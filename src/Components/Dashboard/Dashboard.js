import axios from 'axios';
import React, { useState } from 'react';
import { useEffect,useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Modal from '../Modal/Modal';
import Navbar from '../Navbar/Navbar';
import CreateCourse from './CreateCourse';
import styles from './Dashboard.module.css';
import {courseActions,getCourseIdOnClickactions} from "./../../Redux/course-slice";
import Courses from '../Courses/Courses';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from './../../Redux/user-slice'; 
const joinedCourses =[]

const Dashboard=(props)=> {
  const navigate=useNavigate();
  const [cookie,setCookie]=useCookies();

  // useEffect(()=>{
  // axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
  //   if (res.status === 200){
  //     console.log(res);
  //   }
  // }).catch((err)=>{
  //   console.log(err);
  //   if(err.response.status === 401){
  //     navigate("/")
  //   }
  // })
  // },[])

  const location = useLocation();
  const dispatch=useDispatch();
  const [openModal,setOpenModal] =useState(false)
  const [showDashboard,setShowDashboard]=useState(true);
  const [showCreateCourse,setShowCreateCourse]=useState(false);
  const [showCourse,setShowCourse]=useState(false);
  const [courseIdState,setCourseIdState]=useState(false);

  const courses=useSelector(state=> state.courses);
  const user=useSelector(state=> state.user);
  const joinhandle=()=>{
    setOpenModal(true);
  }

  const createCourseHandler=()=>{
    setShowDashboard(false);
    setShowCreateCourse(true)
  }

  const getCourses=()=>{
    if(user?.userInfo?.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        dispatch(courseActions.courses(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    } 
  }

  const showDashboardHandler=useCallback(()=>{
    setShowDashboard(true);
    setShowCreateCourse(false);
    getCourses();
  },[])

  const [getdata,setgetdata]=useState(false);


  useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/user",{withCredentials:true}, {headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res.data);
        // dispatch(userActions.userInfo(res.data));
        setgetdata(!getdata);
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[])



  useEffect(()=>{
      if(user?.userInfo?.hasOwnProperty("user") === true){
        axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          dispatch(courseActions.courses(res.data.data));
        }).catch((err)=>{
          console.log(err);
        })
      } 
  },[]);


  return (
    <>
    {showCreateCourse && <CreateCourse showDashboardHandler={showDashboardHandler}/>}

    {showCourse && <Courses id={courseIdState}/>}

    {showDashboard &&<div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
      <div>
        <div>
          <div className={styles.joinedHeader} >
          <h1>Published Courses</h1>
          <button onClick={createCourseHandler}>Create Class</button>
          </div>
          <div  className={styles.joinedCourses}>      
            {courses.courses.map((item) => {
              console.log(item);
              return( 
              <div onClick={(e)=>{dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));navigate("/courses")}} className={styles.joinedList}>
                {item.imageUrl !== "" &&
                  <img src={item.imageUrl}></img>
                }
                <h2>{item.courseName}</h2>
              </div>
              )})}     
          </div>
        </div>

        <div className={styles.joinedHeader} >
        <h1>Joined Courses</h1>
        <button onClick={joinhandle}>Join Course</button>
        </div>
        <div className={styles.joinedCourses}>      
          {joinedCourses.map((item) => {return( 
          <div className={styles.joinedList}>{item.name}</div>
          )})}     
        </div>
        {openModal && <Modal closeModal={setOpenModal}/>}
      </div>
    </div>}
    </>
  );
}

export default Dashboard;