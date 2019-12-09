import React from 'react';
import './ThreadCommentList.css';
import ThreadCommentItem from '../ThreadCommentItem/ThreadCommentItem';
import UserContext from '../../utils/context';
import {withRouter} from 'react-router-dom';
import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

class ThreadCommentList extends React.Component {
  static contextType = UserContext;
  state = {
    comments: [],
    renderedComments: [],
    renderedComments2: [],
    currentComment: [],
    mediaTimer: '',
  }

  async componentDidMount() {
    await this.props.getComments();
    await this.setState({comments: this.context.currentThreadComments})
    let renderedComments2 = await this.renderCommentList();
    await this.setState({renderedComments2});
  }

  componentDidUpdate() {
    scroll.scrollToBottom({
      duration: 300,
      smooth: 'easeOutQuart',
      containerId: 'thread-comment-list'
    })
  }
  

  // componentDidUpdate() {
  //   let copy = [];
  //   this.state.comments.forEach(comment => {
  //     if(comment.comment_timestamp === this.context.mediaTimer){
  //       copy.push(comment);
  //     }
  //   })
  //   this.setState({
  //     renderedComments: [...this.state.renderedComments, ...copy]
  //   })
  //   return copy;
  // }

  convertTimeString = timeValue => {
    if(timeValue < 10) {
      return `0${timeValue}`;
    }
    else {
      return `${timeValue}`;
    }
  }

  convertSeconds = seconds => {
    let secondsValue = seconds % 60;
    let hoursValue = seconds > 3600 ? (seconds - (seconds % 3600)) / 3600 : 0;
    let minutesValue = seconds < 3600 ? (seconds - secondsValue) / 60 : (seconds - secondsValue) % 3600 / 60
    let timeArray = [hoursValue, minutesValue, secondsValue]
    let timeStringArray = timeArray.map(time => this.convertTimeString(time))

    let timeString = timeStringArray.join(':')
    return timeString;
  }


  handleTimedComments = () => {
    console.log(this.context.currentThreadComments);
    console.log(this.state.comments);
    let comments = this.state.comments || [];
    return comments.filter(comment => {
      if(comment.comment_timestamp <= this.context.mediaTimer){
        return comment;
      }
    }) || []
  }

  renderCommentList = async () => {
    console.log(this.context.currentThreadComments);
    console.log(this.state.comments);
    if (this.context.currentThreadComments !== this.state.comments) {
      await this.setState({comments: this.context.currentThreadComments});
    }
    let comments = this.handleTimedComments();
    let newData =  comments.map(comment => {
      return (
        <ThreadCommentItem 
        username={comment.user_name} 
        comment={comment.user_comment} 
        timestamp={this.convertSeconds(comment.comment_timestamp)} 
        key={comment.id}
        />
      )
    })
    let finalData;
    if (this.context.currentThreadComments[0]) {
    finalData = `First comment at ${this.convertSeconds(this.context.currentThreadComments[0].comment_timestamp)}`
    }
    else {
      finalData = 'No comments in this thread yet!';
    }
    if (newData.length > 0) { finalData = newData }
    this.setState({renderedComments2: finalData, mediaTimer: this.context.mediaTimer});
  }

  render() {
    if (this.props.match.params.thread === this.context.playingCategory && this.props.match.params.id === this.context.playingID) {
      if (this.context.mediaTimer !== this.state.mediaTimer) {
        this.renderCommentList()
      }
      return (
        <ul id='thread-comment-list'>
          {this.state.renderedComments2}
        </ul>
      )
      }
    else {
      return         <ul className='thread-comment-list'>
        <li>Press play to start this comment thread!</li>
    </ul>
    }
  }
}

export default withRouter(ThreadCommentList);