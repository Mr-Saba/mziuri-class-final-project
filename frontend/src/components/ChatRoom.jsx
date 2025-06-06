import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import { IconButton, Button } from '../components'
import { formatTime, formatDate } from '../utils/textFormat';
import { useUserData } from '../context/UserContext';
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

function ChatRoom({chatRoom, onSendMessage, onDeleteMessages}) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessage] = useState('');
  const { userData } = useUserData()
  const chatBoxRef = useRef(null);

  const menuRef = useRef(null);
  const threeDotButtonRef = useRef(null);

  const emojiPickerRef = useRef(null);

  const matchName = chatRoom?.participants.find(item => item._id !== userData._id).fullName
  const matchTime = formatDate(chatRoom?.createdAt)

  useEffect(() => {
    setMessage('')
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatRoom?.messages]);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setMessage(prev => prev + emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // if (threeDotButtonRef.current && threeDotButtonRef.current.contains(e.target)) {
        //     return; 
        // }
        setMenuVisible(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setEmojiPickerVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className='chatRoom'>
        <div className='upperContainer'>
            <div>
            <div className='userImage'>

            </div>
            <p>You matched with {matchName} on {matchTime}</p>
            </div>
            <IconButton
                icon={ThreeDot}
                size={16}
                onClick={() => setMenuVisible(prev => !prev)}
            />
        </div>
        <div className='chatContainer'>
            <div className='chatBox' ref={chatBoxRef}>
            {chatRoom?.messages.map((item, index) => {
                let isYou = item.sender === userData?._id
                return (
                <div key={index} className={`item ${isYou ? 'send' : 'receive'}`}>
                    {!isYou && 
                    <div className='userImage'>

                    </div>
                    }
                    <div className='messageAndTime'>
                        <p>
                            {item.message}
                        </p>
                        <span className='time'>{formatTime(item.createdAt)}</span>
                    </div>
                </div>
                )
            })}
            </div>
        </div>
        <div className='bottomContainer'>
            <input 
                name='message'
                value={message || ''}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Type a message...'
            />
            <div className='emojiContainer' ref={emojiPickerRef}>
                <IconButton
                    ref={threeDotButtonRef}
                    icon={Emoji}
                    size={16}
                    onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                />
                {/* <EmojiPicker 
                className={`emojiPicker ${emojiPickerVisible ? 'visible' : ''}`} 
                onEmojiClick={handleEmojiClick}
                /> */}

                <Suspense fallback={null}>
                    {emojiPickerVisible && (
                        <LazyEmojiPicker 
                            className='emojiPicker visible' 
                            onEmojiClick={handleEmojiClick} 
                        />
                    )}
                </Suspense>
            </div>
            <IconButton
                icon={SendMessage}
                size={16}
                additionalClassnames={'green'}
                onClick={() => onSendMessage(message)}
            />
        </div>

        {menuVisible && (
            <div className='threeDotMenu' ref={menuRef}>
                <Button                 
                    additionalClassnames="secondary"
                >
                    Report User
                </Button>
                <Button                 
                    additionalClassnames="secondary"
                    onClick={onDeleteMessages}
                >
                    Delete Messages
                </Button>
            </div>
        )}
    </div>
  )
}

export default ChatRoom