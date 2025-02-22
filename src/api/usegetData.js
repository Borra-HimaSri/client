import { useState, useEffect } from "react";

const useGetData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    // POST function
    const postData = async (newData) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error("Failed to post data");
            }

            const result = await response.json();
            setData([...data, result]); // Update state with new data
            return result;
        } catch (error) {
            setError(error.message);
        }
    };

    // PUT (Update) function
    const updateData = async (id, updatedData) => {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update data");
            }

            const result = await response.json();
            setData(data.map((task) => (task._id === id ? result : task))); // Update the specific task
            return result;
        } catch (error) {
            setError(error.message);
        }
    };

    // DELETE function with optimistic updates
    const deleteData = async (id) => {
        // Optimistically remove the task from the local state
        const previousData = [...data]; // Save the current state in case of failure
        setData(data.filter((task) => task._id !== id));

        try {
            const response = await fetch(`${url}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete data");
            }

            // If successful, no need to do anything since the task is already removed
        } catch (error) {
            // Revert the state if the request fails
            setData(previousData);
            setError(error.message);
        }
    };

    return { data, loading, error, postData, updateData, deleteData };
};

export default useGetData;