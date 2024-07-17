import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeCard from "../components/RecipeCard.jsx";

const AddRecipe = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [image, setImage] = useState(null);
    const [share, setShare] = useState(false);
    const [steps, setSteps] = useState(['']);

    const fileRef = useRef();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const onFileChange = () => {
        setImage(fileRef.current.files[0]);
    }

    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await axios.get('/api/recipe/getmycategories')
            setCategories(data);
        }

        loadCategories();

    },[])

    const onAddIngredientClick = async () => {
        setIngredients([...ingredients, ('')]);
    }
    const onAddStepClick = async () => {
      
        setSteps([...steps, ('')]);
        console.log(steps);
    }

    const onUpdateIngredient = (index, event) => {
        const values = [...ingredients];
        values[index] = event.target.value;
        setIngredients(values);
    };

    const onUpdateSteps = (index, event) => {
        const values = [...steps];
        values[index] = event.target.value;
        setSteps(values);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/recipe/addrecipe', { title, category, ingredients, steps, share, imageBase64Data: await toBase64(image) });
        navigate('/');
    };

    let imageUrl = '';
    if (image) {
        imageUrl = URL.createObjectURL(image);
    }

    return (
        <div className="container mt-5 d-flex">
            <div className="card shadow-sm" style={{ maxWidth: '600px', width: '100%', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <h2 className="mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#343a40' }}>Add a New Recipe</h2>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                            <label htmlFor="title" className="form-label">Recipe Title</label>
                        <input type="text" className='form-control' name='title' value={title} onChange={e => setTitle(e.target.value)}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="-1">Select a category</option>
                                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                    </div>
                    <div className="mb-3">
                            <label htmlFor="ingredients" className="form-label">Ingredients</label>
                            {ingredients.map((i, index) =>
                            
                                <input key={index} type="text" className="form-control" name='ingredients' value={i} onChange={(e) => onUpdateIngredient(index, e)} />
                        )}
                            <button type="button" className="btn btn-success" onClick={onAddIngredientClick}>Add Ingredient</button>
                        
                    </div>
                    <div className="mb-3">
                            <label htmlFor="steps" className="form-label">Steps</label>
                        {steps.map((s, index) =>
                            <textarea key={index} className="form-control mb-2" rows="3" name={ingredients} value={s} onChange={(e) => onUpdateSteps(index, e)}></textarea>
                        )}
                            <button type="button" className="btn btn-info" onClick={onAddStepClick}>Add Step</button>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload Image</label>
                            <input ref={fileRef} onChange={onFileChange} type="file" className="form-control" id="image" />
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" id="share" checked={share} onChange={(e) => setShare(e.target.checked)} />
                            <label className="form-check-label" htmlFor="share">
                                Share this recipe publicly
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '10px' }} onChange={handleSubmit}>Add Recipe</button>
                    </form>
                </div>
            </div>
            <div className="card shadow-sm ms-4" style={{ position: 'sticky', top: '20px', maxWidth: '400px', width: '100%', height: 'fit-content', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <h3 className="text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#343a40' }}>Recipe Preview</h3>
                    <RecipeCard
                        title={title}
                        imageUrl={imageUrl}
                        category={category}
                        ingredients={ingredients}
                        steps={steps}
                        share={share}
                    ></RecipeCard>
                </div>
            </div>
        </div>
    )
}

export default AddRecipe;