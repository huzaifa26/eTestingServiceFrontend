import React, { useDebugValue } from 'react';
import styles from './Courses.module.css';
import {Editor} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useLocation} from "react-router-dom";
import { useSelector } from 'react-redux';
import {getCourseIdOnClickactions} from "./../../Redux/course-slice";
import { useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import PeopleIcon from '@mui/icons-material/People';
import KeyIcon from '@mui/icons-material/Key';
import CountUp from 'react-countup';

const Courses=(props) => {
  const [cookie,setCookie]=useCookies();
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const location=useLocation();
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const user=useSelector(state=> state.user);
  const [totalUser,setTotalUser] = useState(0)
  
  const [courses,setCourses] = useState([])
  const [courseJoin,setCourseJoin] = useState([])
  console.log(courseIdredux)


  const [refreshTokenState,setRefreshToken]=useState(false);
  // useEffect(()=>{
  //   axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true}).then((res)=>{
  //     if (res.status === 200){
  //       console.log(res);
  //     }
  //   }).catch((err)=>{
  //     console.log(err);
  //     if(err.response.status === 401){
  //       navigate("/")
  //     }
  //     if(err.response.status === 403){
       
  //     }
  //   })
  // },[])


  // useEffect(()=>{
  //   axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true}).then((res)=>{
  //     if (res.status === "200"){
  //       console.log(res);
  //     }
  //   }).catch((err)=>{
  //     console.log(err);
  //     if(err.response.status === 401){
  //       navigate("/")
  //     }
  //   })
  // })

  useEffect(()=>{
    axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      setCourses(res.data.data)
    }).catch((err)=>{
      console.log(err);
    })
  },[]);
  
  useEffect(()=>{
    axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      setCourseJoin(res.data.data)
  }).catch((err)=>{
    console.log(err);
  })
},[]);

  useEffect(() => {
      axios.get("http://localhost:5000/api/enrolledLength/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        setTotalUser(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
  }, [])

  return (
    <div className={styles.Main}>
    
    
    { typeof(courseIdredux) === "object" &&  <>

    <div className={styles.publishedHeader}>
        <h1>Classes</h1>
    </div>
      
    <div className={styles.publishedCoursesOuter}>

      <div className={styles.publishedCourses}>
        <div className={styles.flexDiv}>
          <h1 style={{fontSize:"24px",fontWeight:"900"}}>Published Classes</h1>
        </div>
          {
            courses.map((item,index)=>{
              return(
                <div className={styles.flexDiv2} onClick={(e)=>{
                  dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id))
                  }}>
                <h1>{item.courseName}</h1>
              </div>
              )
            })
          }
      </div>

      <div className={styles.joinedCourses}>
          <div className={styles.flexDiv}>
            <h1 style={{fontSize:"24px",fontWeight:"900"}}>Joined Classes</h1>
          </div>
            {
              courseJoin.map((item,index)=>{
                return(
                <div className={styles.flexDiv2} onClick={(e)=>{
                  dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id))
                  }}>
                  <h1>{item.courseName}</h1>
                </div>
                )
              })
            }
        </div>  
    </div>  
    </> }

    { (typeof(courseIdredux)  !== "object" && user.userInfo.user.id == courseClickUserId) &&  
       
      <div className={styles.courseInfo}>

        <div className={styles.join}>
          <div className={styles.secondry}>
            <div className={styles.people}>
              <KeyIcon style={{fontSize:'40px'}}/>
            </div>

            <div>
            <p>JOINING KEY </p>
            </div>
          </div>

          <div className={styles.footer}>
            <b style={{fontSize:'40px'}}>{courseIdredux}</b>
          </div>
        </div>

        <div className={styles.totalStudents}>
          <div className={styles.secondry}>
            <div className={styles.people}>
              <PeopleIcon style={{fontSize:'40px'}}/>
            </div>

            <div>
            <p>E N R O L L E D</p>
            </div>
          </div>
          <div className={styles.footer}>
            <p style={{fontSize:'40px'}}><CountUp style={{fontSize:'40px'}} start={0} end={totalUser} /></p>
          </div>
        </div>
        
      </div>
    } 

    { (typeof(courseIdredux)  !== "object" && user.userInfo.user.id !== courseClickUserId) &&  
       
       <div className={styles.courseInfo}>
         <h3>Description</h3>
         <p>(To be added later)</p>
       </div>
     } 
     
    </div>
  );
}

export default Courses;