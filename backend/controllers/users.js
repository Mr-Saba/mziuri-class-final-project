import Users from '../models/users.js';
import ChatRooms from '../models/chatRooms.js';
import Messages from '../models/messages.js';
import {hashPassword, comparePassword} from '../utils/bcrypt.js'
import {sendResetPasswordMail, sendContactMail} from '../utils/mailSender.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, city, password, gender, favoriteGenre, favoriteInstrument, date } = req.body;
        
        const hashedPassword = await hashPassword(password)
        
        const newUser = new Users({
            fullName: fullName,
            email: email,
            city: city,
            password: hashedPassword,
            gender: gender,
            favoriteGenre: favoriteGenre,
            favoriteInstrument: favoriteInstrument,
            date: date,
            avatarIndex: Math.floor(Math.random() * 4) + 1,
            // media: media,
        });
        
        await newUser.save()
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        
        const userObj = newUser.toObject();
        delete userObj.password;

        await checkAndCreateChatroomWithBot(newUser._id)
        
        return res.status(201).json({ data: userObj });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ err: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({ err: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const userObj = user.toObject();
        delete userObj.password;

        await checkAndCreateChatroomWithBot(user._id)

        return res.status(200).json({ data: userObj });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ data: 'User has logged out' });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const getToken = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ err: 'Please login now!' });

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return res.status(400).json({ msg: 'Please login now!' });
            return res.status(200).json({ data: token });
        });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
    
};

export const getUser = async (req, res) => {
    try {
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const userData = await Users.findById(userId)
            .select('-password')

        // console.log(userData)
        await checkAndCreateChatroomWithBot(userId)

        return res.status(200).json({ data: userData });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const forgotPasswordUser = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await Users.findOne({ email: email });
        if(!user) {
            return res.status(400).json({err: "Email is incorrect!"})
        }

        const access_token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASS_SECRET_KEY, { expiresIn: '15m' });
        const url = `https://demo-melodymatch.onrender.com/reset-password/${access_token}`  

        await sendResetPasswordMail(email, url)

        return res.status(200).json({ data: "Check your email for further instructions" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const getGuestUser = async (req, res) => {
    try {
        const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
        const guestUsername = `guest${randomNum}`;
        const guestEmail = `guest${randomNum}@guest.local`;
        const dummyPassword = await hashPassword(`guest_password_${randomNum}`);
        const newGuest = new Users({
            fullName: guestUsername,
            email: guestEmail,
            city: "Tbilisi",
            password: dummyPassword,
            gender: "male",
            favoriteGenre: "ROCK",
            favoriteInstrument: "Organ",
            date: '2002-02-26',
            avatarIndex: Math.floor(Math.random() * 4) + 1,
            bio: "Yes, I am a demo musician to create digital journeys 🕺",
            isGuest: true,
            media: [
                'https://images.unsplash.com/photo-1623410439361-22ac19216577?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1692107304287-4eb0e5c4c550?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            ]
        });

        await newGuest.save();

        // Update other users
        await Users.updateMany(
            { isTest: { $ne: true }, isBot: { $ne: true } },
            { $addToSet: { likedUsers: newGuest._id } }
        );

        const token = jwt.sign({ id: newGuest._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const userObj = newGuest.toObject();
        delete userObj.password;

        await checkAndCreateChatroomWithBot(newGuest._id)

        return res.status(201).json({ data: userObj });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const resetPasswordUser = async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS_SECRET_KEY);
        const userId = decoded.id;

        const hashedPassword = await hashPassword(password)

        await Users.findOneAndUpdate({_id: userId}, {
            password: hashedPassword
        })

        return res.status(200).json({ data: "Password successfully changed!" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const contact = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        await sendContactMail(email, subject, message)
        return res.status(200).json({ data: "Email has sent!" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const updateUser = async (req, res) => {
  try {
    const { _id, fullName, email, city, gender, favoriteGenre, favoriteInstrument, date, password } = req.body;

    // Validate user exists
    const user = await Users.findById(_id);
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    const updatedData = {
      fullName,
      email,
      city,
      gender,
      favoriteGenre,
      favoriteInstrument,
      date
    };

    // If password is provided and confirmed, hash and include it
    if (password) {
      updatedData.password = await hashPassword(password);
    }

    const updatedUser = await Users.findByIdAndUpdate(_id, updatedData, {
      new: true,
      select: '-password', // exclude password from response
    });

    return res.status(200).json({ data: updatedUser });
  } catch (err) {
    return res.status(500).json({ err: 'Failed to update user' });
  }
};

export const discover = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await Users.findById(userId);

        const exclude = [...user.likedUsers, ...user.dislikedUsers, user._id];
        const usersToShow = await Users.aggregate([
            { 
                $match: { 
                    _id: { $nin: exclude }, //exclude liked
                    isBot: { $ne: true }, //exclude bot
                    isGuest: { $ne: true }, //exclude guests
                    isTest: { $ne: true }, //exclude tests
                } 
            },
            { $sample: { size: 1 } }
        ]);


        return res.status(200).json({ data: usersToShow[0] })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}

export const like = async (req, res) => {
    try {
        const { userId } = req.body; // user who is liking
        const { targetId } = req.params; // user who is being liked

        if (userId === targetId) return res.status(400).json({ err: "Cannot like yourself" });

        const user = await Users.findById(userId);
        const targetUser = await Users.findById(targetId);

        console.log(targetUser.likedUsers, userId, targetUser.likedUsers.includes(userId))

        if (!user || !targetUser) return res.status(404).json({ err: "User not found" });

        if (user.likedUsers.includes(targetId)) return res.status(400).json({ err: "Already liked" });

        user.likedUsers.push(targetId);

        // Check for match
        const isMatch = targetUser.likedUsers.includes(userId);
        if (isMatch) {
            user.matches.push(targetId);
            targetUser.matches.push(userId);

            await targetUser.save(); // save target because matches updated

            //find or create chatroom
            let chatRoom = await ChatRooms.findOne({
                participants: { $all: [userId, targetId] }
            });

            if (!chatRoom) {
                chatRoom = new ChatRooms({ participants: [userId, targetId] });
                await chatRoom.save();
            }
        }

        await user.save();

        const responseData = {
            message: isMatch ? "It's a match!" : "Liked",
            isMatch: isMatch
        }

        return res.status(200).json({ data: responseData })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}

export const dislike = async (req, res) => {
    try {
        const { userId } = req.body; // user who is disliking
        const { targetId } = req.params; // user who is being disliked

        if (userId === targetId) return res.status(400).json({ err: "Cannot dislike yourself" });

        const user = await Users.findById(userId);
        const targetUser = await Users.findById(targetId);

        if (!user || !targetUser) return res.status(404).json({ err: "User not found" });

        if (user.dislikedUsers.includes(targetId)) return res.status(400).json({ err: "Already disliked" });

        user.dislikedUsers.push(targetId);
        await user.save();

        return res.status(200).json({ data: 'Disliked' })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}

const checkAndCreateChatroomWithBot = async (userId) => {
    // create chat with bot if it doesn't exist
    const bot = await Users.findOne({ isBot: true });

    let botRoom = await ChatRooms.findOne({
        participants: { $all: [userId, bot._id] }
    });

    if (!botRoom) {
        botRoom = new ChatRooms({ participants: [userId, bot._id] });
        await botRoom.save();

        // send initial message from the bot
        const welcomeMessage = new Messages({
            sender: bot._id,
            chatRoom: botRoom._id,
            message: "Hi there! I'm MelodyMatch Bot 🤖 — your AI music buddy."
        });

        await welcomeMessage.save();
    }
}