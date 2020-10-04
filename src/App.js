import React from 'react';
import './App.css';
import Chatkit from '@pusher/chatkit'
import MessageList from './Components/MessageList'
import SendMessageForm from './Components/SendMessageForm'
import RoomList from './Components/RoomList'
import NewroomForm from './Components/NewroomForm'
import {tokenUrl, instanceLocator} from './config'

// import Image from './Images/par.jpeg'
class App extends React.Component {
   
  constructor() {
    super()
    this.state = {
        roomId: null,
        messages: [],
        joinableRooms: [],
        joinedRooms: []
    }
    // this.sendMessage = this.sendMessage.bind(this)
    // this.subscribeToRoom = this.subscribeToRoom.bind(this)
    // this.getRooms = this.getRooms.bind(this)
    // this.createRoom = this.createRoom.bind(this)
} 

 
subscribeToRoom(roomId) {
  this.setState({ messages: [] })
  this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
          onNewMessage: message => {
              this.setState({
                  messages: [...this.state.messages, message]
              })
          }
      }
  })
  .then(room => {
      this.setState({
          roomId: room.id
      })
      this.getRooms()
  })
  .catch(err => console.log('error on subscribing to room: ', err))
}

sendMessage(text) {
  this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
  })
}
  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'perborgen',
      tokenProvider: new Chatkit.TokenProvider({
          url: tokenUrl
      })
  })
  
  chatManager.connect()
  .then(currentUser => {
     currentUser.subscribeToRoom({
      roomId: this.state.roomId,
     })
      // this.currentUser = currentUser
      // this.getRooms()
  })
  .catch(err => console.log('error on connecting: ', err))
  }
  render(){
    return (
      <div className="App">
         <MessageList/>
         <RoomList  
            subscribeToRoom={this.subscribeToRoom}
            rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
            roomId={this.state.roomId} />
        <MessageList 
            roomId={this.state.roomId}
            messages={this.state.messages} />
        <SendMessageForm
            disabled={!this.state.roomId}
            sendMessage={this.sendMessage} />
        <NewroomForm createRoom={this.createRoom} />
         {/* <SendMessageForm/> */}
          {/* <RoomList/>
          <MessageList/>
          <SendMessageForm/>
          <NewroomForm/> */}
      </div>
    );
 }
}


export default App;
