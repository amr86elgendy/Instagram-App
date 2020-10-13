import React, { Fragment, useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const FollowingPosts = () => {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      const { data } = await Axios.get('http://localhost:5000/posts/following', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      
      setPosts(data.posts);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Like Post
  const likePost = async (id) => {
    const {
      data: { postLiked },
    } = await Axios.put(
      'http://localhost:5000/posts/like',
      { postId: id },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );

    const updated_posts_after_like = posts.map((post) => {
      if (post._id == postLiked._id) {
        return postLiked;
      } else {
        return post;
      }
    });
    setPosts(updated_posts_after_like);
  };

  // UNLike Post
  const unlikePost = async (id) => {
    const {
      data: { postLiked },
    } = await Axios.put(
      'http://localhost:5000/posts/unlike',
      { postId: id },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );

    const updated_posts_after_unlike = posts.map((post) => {
      if (post._id == postLiked._id) {
        return postLiked;
      } else {
        return post;
      }
    });
    setPosts(updated_posts_after_unlike);
  };

  // Write Comment
  const writeComment = async (text, postId) => {
    const { data: { postCommented } } = await Axios.put(
      'http://localhost:5000/posts/comment',
      { text, postId },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    
    const updated_posts_after_comment = posts.map((post) => {
      if (post._id == postCommented._id) {
        return postCommented;
      } else {
        return post;
      }
    });
    setPosts(updated_posts_after_comment);
  }

  const deletePost = async (postId) => {
    const { data: {deletedPost} } = await Axios.delete(`http://localhost:5000/posts/delete/${postId}`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    const updated_posts_after_delete = posts.filter(post => post._id !== deletedPost._id);
    setPosts(updated_posts_after_delete)
  }

  return (
    <Fragment>
      {posts &&
        posts.map((post) => {
          const {
            _id,
            likes,
            comments,
            title,
            body,
            photo,
            postedBy,
          } = post;
          return (
            <div className='card home-card' key={_id}>
              <h5 style={{padding: '5px'}}><Link to={postedBy._id !== state._id ? `/profile/${postedBy._id}` : `/profile`}>{postedBy.name}</Link> {postedBy._id === state._id && <i className='material-icons right red-text' onClick={() => deletePost(_id)}>delete</i>}</h5>
              <div className='card-image'>
                <img src={photo} alt={postedBy.name} />
              </div>
              <div className='card-content'>
                <i className='material-icons' style={{ color: 'red' }}>
                  favorite
                </i>
                {likes.includes(state._id) ? (
                  <i className='material-icons' onClick={() => unlikePost(_id)}>
                    thumb_down
                  </i>
                ) : (
                  <i className='material-icons' onClick={() => likePost(_id)}>
                    thumb_up
                  </i>
                )}
                <h6>{likes.length} likes</h6>
                <h6>{title}</h6>
                <p>{body}</p>
                {comments.map(comment => {
                  return (
                    <h5 key={comment._id}><span style={{fontWeight: '500'}}>{comment.postedBy.name}: </span>{comment.text}</h5>
                  )
                })}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  writeComment(e.target[0].value, _id)
                  }}>
                  <input type='text' placeholder='Add a Comment' />
                </form>
              </div>
            </div>
          );
        })}
    </Fragment>
  );
};

export default FollowingPosts;
