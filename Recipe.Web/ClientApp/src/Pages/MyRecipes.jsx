import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import RecipeCard from "../components/RecipeCard.jsx";
import { Link } from 'react-router-dom';

const MyRecipes = () => {

    const [recipes, setRecipes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getRecipes = async () => {
            const { data } = await axios.get('/api/recipe/getmyrecipes');
            setRecipes(data);
        }

        getRecipes();
    }, []);

    return (
        <div className="container mt-5" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
            <div className="jumbotron bg-light p-5 rounded-lg mb-4 shadow">
                <h1 className="display-4">Welcome to Recipe Sharing App!</h1>
                <p className="lead">Here are your recipes!!</p>
                
            </div>
            {recipes.length > 0 || <>
                <hr className="my-4" />
                <p>You do not have any recipes posted. Add one now</p>
                <Link to="/addrecipe">Add Recipe</Link></>}
            {recipes.length > 0 && recipes.map(r =>
                <div className="col-md-4 mb-4" key={r.id}>
                    <RecipeCard
                        title={r.title}
                        category={r.category}
                        ingredients={r.ingredients}
                        steps={r.steps}
                        share={r.share}
                    />
                </div>
            )}

        </div>
    )

}
export default MyRecipes;