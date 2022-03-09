import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if(currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(
      ["posts", nextPage], 
      () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, isLoading, error } = useQuery(
    ["posts", currentPage], 
    () => fetchPosts(currentPage), 
    {
      staleTime: 2000,
      keepPreviousData: true,
    });
  //by default, useQuery will try 3 times
  //staleTime - "max age" / how long you can tolerate data being out of date
  //cacheTime - data in cache expires after 5 minutes since last active useQuery
  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>{error.toString()}</h3>;
  //isFetching - async query has not resolved
  //isLoading - in fetching state, no cached data

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1);
          }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button 
          disabled={ currentPage >= maxPostPage} 
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
          }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
