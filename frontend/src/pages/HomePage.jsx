import JobListing from "../components/JobListing";
import { useEffect, useState } from "react";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJob = async () => {
      const response = await fetch(`/api/jobs`);
      const json = await response.json();

      if (response.ok) {
        setJobs(json);
      }
      console.log(jobs)
    };

    fetchJob();
  }, []);
  return (
    <div className="home">
      <div className="job-list">
        {jobs.length === 0 && <p>No jobs found</p>}
        {jobs.length !== 0 &&
          jobs.map((job) => <JobListing key={job.id} {...job} />)}
      </div>
    </div>
  );
};

export default Home;
