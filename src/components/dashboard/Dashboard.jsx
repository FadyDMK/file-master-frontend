import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Folder from "./folder/Folder";
import styles from "./Dashboard.module.css";
import File from "./file/File";

// TODO: Implement BreadCrumbs
// TODO: Implement File Upload/Download/Delete
// TODO: Implement Folder Creation

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [folder, setFolder] = useState({
    id: 21,
    name: "index_16",
    path: "uploads/index_16",
    createdAt: "2024-12-08T17:33:18.041Z",
    updatedAt: "2024-12-08T17:33:18.041Z",
    parentId: null,
    ownerId: 16,
  });
  const [error, setError] = useState("");
  const [breadcrumb, setBreadcrumb] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  //get current folder name
  useEffect(() => {
    const fetchName = async () => {
      try {
        const folderId = new URLSearchParams(location.search).get("folderId");
        if (folderId) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/files/folders/${folderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setFolder(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };

    const fetchData = async () => {
      try {
        const folderId = new URLSearchParams(location.search).get("folderId");
        const url = folderId
          ? `${import.meta.env.VITE_BACKEND_URL}/api/files/${folderId}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/files/main-folder`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFiles(response.data.files || []);
        setSubfolders(response.data.folders);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };

    const getBreadcrumb = async () => {
      try {
        const folderId = new URLSearchParams(location.search).get("folderId");
        if (folderId) {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/files/breadcrumb/${folderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setBreadcrumb(response.data);
          setBreadcrumb((prev) => {
            return prev.map((folder, index) => {
              if (index === 0) {
                return { ...folder, name: "Home" };
              }
              return folder;
            });
          });
        }
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };
    getBreadcrumb();
    fetchName();
    fetchData();
  }, [location.search]);

  const handleFolderClick = (folderId) => {
    navigate(`/files?folderId=${folderId}`);
  };

  const handleFileClick = async (fileId, fileName) => {
    axios({
      url: `${import.meta.env.VITE_BACKEND_URL}/api/files/download/${fileId}`,
      method: "GET",
      responseType: "blob", // Important to handle binary files
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        {breadcrumb.length > 1
          ? breadcrumb.map((folder) => (
              <span
                key={folder.id}
                className="text-blue-400 cursor-pointer"
                onClick={() => handleFolderClick(folder.id)}
              >
                {folder.name} <span className="text-black">{">"} </span>
              </span>
            ))
          : ""}
      </div>
      <ul className={styles.folderGroup}>
        {subfolders.map((folder) => (
          <li key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            <Folder name={folder.name} />
          </li>
        ))}
      </ul>

      <ul className={styles.folderGroup}>
        {files.map((file) => (
          <li
            key={file.id}
            className="text-blue-400 cursor-pointer"
            onClick={() => handleFileClick(file.id, file.name)}
          >
            <File name={file.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
