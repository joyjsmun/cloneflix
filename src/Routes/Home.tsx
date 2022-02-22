import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "./api";
import { makeImagePath } from "./utils";
import {motion,AnimatePresence} from "framer-motion";
import { useState } from "react";
import { useHistory,useRouteMatch} from "react-router-dom";


const Wrapper = styled.div`
    background: black;
    padding-bottom: 200px;
`

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;


`

const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),
    url(${(props) => props.bgPhoto});
    background-size: cover;
   
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`

const Slider = styled.div`
position: relative;
top:-100px;
`;

const Row = styled(motion.div)`
   display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 170px;
    &:first-child{
       transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
    cursor: pointer;

`

const Info = styled(motion.div)`
    padding:10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`

const rowVariansts = {
    hidden:{
        x:window.outerWidth + 5,
    },
    visible:{
        x:0,
    },
    exit:{
        x:-window.outerWidth -5,
    }
}


const offset = 6;

const boxVariants = {
    normal:{
        scale:1,
    },
    hover:{
        zIndex:99,
        scale:1.3,
        y:-50,
        transition:{
            delay:0.5,
            duration:0.3,
            type:"tween"
        }

    }
}

const infoVariants = {
    hover:{
        opacity:1,
        transition:{
            delay:0.5,
            duration:0.3,
            type:"tween"
        }
    }
}


function Home(){
    const history = useHistory();
    const routeMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
    console.log(routeMovieMatch);
    const {data, isLoading} = useQuery<IGetMoviesResult>(
        ["movies","nowPlaying"],
        getMovies
        );
    console.log(data?.results[0].title);

    const [index,setIndex] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const increaseIndex = () => {
        if(data){
            if(leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length -1;
            const maxIndex = Math.floor(totalMovies/offset) -1;
            setIndex((prev) => prev === maxIndex ? 0 : prev +1);
        }
    }
const toggleLeaving = () => setLeaving((prev) => !prev);
const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`)
}
    return <Wrapper>
        {isLoading ? (
            <Loader>Loading..</Loader> 
            ): (
        <>   
            <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <Overview>{data?.results[0].overview}</Overview>
            </Banner>
            <Slider>
               <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
               <Row 
               variants={rowVariansts}
               initial="hidden"
               animate="visible"
               exit="exit"
               transition={{type:"tween",duration:1}}
               key={index} >
                  {data?.results.slice(1).slice(offset*index,offset*index+offset).map((movie) => (
                      <Box 
                      layoutId={movie.id +""}
                      variants={boxVariants}
                      key={movie.id}
                      onClick = { () => onBoxClicked(movie.id)}
                      initial="normal"
                      whileHover= "hover"
                      transition={{type:"tween"}}
                      bgPhoto={makeImagePath(movie.backdrop_path,"w500")}
                      >
                          <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                          </Info>
                      </Box>
                  ))}
                </Row>
               </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {routeMovieMatch ? 
                <motion.div layoutId={routeMovieMatch.params.movieId}
                style={{
                position:"absolute", width:"40vw", height:"80vh",backgroundColor:"red",
                top:50,
                left:0,
                right:0,
                margin:"0 auto"}}/> : null}
            </AnimatePresence>
                </>)}
    </Wrapper>;
}

export default Home;