import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteJob = async () => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });

      if (!res.ok) {
        // بعضی بک‌اندها json برمی‌گردونن، بعضی نه
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || data.message || "Failed to delete job");
        return;
      }

      // بعد از حذف، برگرد Home تا لیست دوباره fetch بشه
      navigate("/");
    } catch (err) {
      setDeleteError("Network error while deleting job");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          setError(`Failed fetching job (status ${res.status})`);
          setJob(null);
          return;
        }

        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Network error while fetching job");
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="job-details">Loading...</div>;
  }

  if (error) {
    return <div className="job-details">{error}</div>;
  }

  if (!job) {
    return <div className="job-details">Job not found</div>;
  }

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p>Type: {job.type}</p>
      <p>Description: {job.description}</p>
      <p>Company: {job.company?.name}</p>
      <p>Contact Email: {job.company?.contactEmail}</p>
      <p>Contact Phone: {job.company?.contactPhone}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Posted Date: {job.postedDate}</p>

      <Link to={`/edit-job/${id}`}>
        <button>Edit Job</button>
      </Link>

      <button onClick={deleteJob} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete Job"}
      </button>

      {deleteError && <p>{deleteError}</p>}
    </div>
  );
};

export default JobPage;
