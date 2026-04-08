import axios from 'axios';
import PostCard from './../PostCard/PostCard';
import LoaderScreen from '../LoaderScreen/LoaderScreen';
import { useQuery } from '@tanstack/react-query';
import PostCreation from '../PostCreation/PostCreation';

export default function Home() {

  // const [allPosts, setAllPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);



  // function getAllPosts() {
  //   setIsLoading(true);
  //   setErrorMessage(null);

  //   axios.get(`https://route-posts.routemisr.com/posts`, {
  //     params: {
  //       sort: '-createdAt',
  //       limit: 20
  //     },
  //     headers: {
  //       token: localStorage.getItem('token')
  //     }
  //   })
  //     .then(function (resp) {
  //       setAllPosts(resp.data.data.posts);
  //     })
  //     .catch(function (error) {
  //       console.log("Error", error);
  //       setIsError(true);
  //       setErrorMessage(error.response.data.message)

  //     })
  //     .finally(function () {
  //       setIsLoading(false)
  //     });
  // }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   getAllPosts();
  // }, []);

  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      params: { sort: '-createdAt'},
      headers: { token: localStorage.getItem('token') }
    })
      .then(response => response.data);
  }

  // used for GET methods & MUST RETURN PROMISE
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPosts'],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return (
      <LoaderScreen></LoaderScreen>
    );
  }

  if (isError) {
    return <div className="block mb-5 bg-red-500 w-100 mx-auto text-white text-center text-sm px-4 py-3 rounded-md ">
      <p>Error occured, please try again...</p>
    </div>
  }
  const allPosts = data.data.posts;
  // console.log(allPosts)


  return (
    
    <>
    <PostCreation />
      {allPosts.map(post => <PostCard key={post._id} postInfo={post} queryKey={['getPosts']} />)}
    </>
  );
}
