import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate} from 'react-router-dom';


const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCategories = async () => {
            const { data } = await axios.get('/api/recipe/getmycategories');
            setCategories(data);
            setLoading(false);
        }

        getCategories();
    }, []);

    const handleAddCategory = async () => {
        setLoading(true);
        await axios.post(`/api/recipe/addcategory?newCategory=${ newCategory }`);
        navigate('/');
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px'}}>
            <h2 className="mb-4 text-center">Categories</h2>
            <form onSubmit={handleAddCategory} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Add</button>
                </div>
            </form>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                    <ul className="list-group shadow-sm">
                        {categories.map((category) => (
                            <li key={category.name} className="list-group-item d-flex justify-content-between align-items-center">
                                {category.name}
                                <span className="badge bg-primary rounded-pill">{category.count}</span>
                            </li>
                        ))}
                    </ul>
            )}
        </div>
    );
};


export default CategoryList;