import {formatISO9075} from "date-fns";
import { Link, Navigate } from "react-router-dom";

export default function post({_id,title,summary,cover,content,createdAt,author}){

  return (
    <div className='Post'>
    <div className='image'>
    <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt=""/>
     </Link>
   </div>
    <div className='text'>
    <Link to ={`/post/${_id}`}>
    <h2> {title} </h2>
    </Link>
    <p className='Info'>
      <a className='author'>{author.username}</a>
      <time>{formatISO9075(new Date(createdAt))}</time>
    </p>
    <p className='summary'>{summary}</p>
    <button onClick={(e)=> {const url ='http://localhost:4000/delete' + _id;
    fetch("http://localhost:4000",{method: "DELETE"}).then((response) => {
      if(response.ok)
     Navigate('/post');
    })
       .catch((e) => {
      console.log(e);
    });
    }}  style={{width:'70px', marginLeft:'400px'}}>Delete</button>
  </div>
  </div>
  );
  }