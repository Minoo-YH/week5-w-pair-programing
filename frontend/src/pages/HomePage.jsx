
import { useEffect, useState } from "react";
import JobListing from "../components/JobListing";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");

        if (!res.ok) {
          console.error("Failed fetching jobs", res.status);
          setJobs([]);
          return;
        }

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  if (!jobs || jobs.length === 0) {
    return <p>No jobs found</p>;
  }

  return (
    <div>
      {jobs.map((job) => {
        const jobId = job.id ?? job._id;
        return (
          <div key={jobId} data-testid={`job-listing-${jobId}`}>
            <JobListing job={job} />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;



