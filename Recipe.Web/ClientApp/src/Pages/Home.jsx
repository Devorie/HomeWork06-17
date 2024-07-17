import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import RecipeCard from "../components/RecipeCard.jsx";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {

    const fileRef = useRef();

    const [recipes, setRecipes] = useState([]);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getRecipes = async () => {
            const { data } = await axios.get('/api/recipe/getrecent');
            setRecipes(data);
            setIsLoading(false);
        }

        getRecipes();
    }, []);

    if (isLoading) {
        return <div className='container' style={{ marginTop: 300 }}>
            <div className='d-flex w-100 justify-content-center align-self-center'>
                <img src='/src/images/loadingimage/Ripple@1x-1.0s-200px-200px.gif' />
            </div>
        </div>
    }

    return (
        <div className="container mt-5" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
            <div className="jumbotron bg-light p-5 rounded-lg mb-4 shadow">
                <h1 className="display-4">Welcome to Recipe Sharing App!</h1>
                <p className="lead">Explore the most delicious recipes shared by our community. Share your own recipes and get inspired by others!</p>
                <hr className="my-4" />
                {recipes.length > 0 && <p>Here are some of the latest recipes:</p>}
                {recipes.length > 0 || <>
                    <p>Be the first to share your recipe!</p>
                    <Link to="/addrecipe">Add Recipe</Link></>
                }
            </div>
            {recipes.length > 0 && recipes.map((r, index) => (
                <div className="col-md-4 mb-4" key={index}>
                <RecipeCard
                        title={r.title}
                        category={r.category}
                        ingredients={r.ingredients}
                        steps={r.steps}
                        share={r.share}
                        imageUrl={`/api/recipes/viewimage?imageUrl=${r.image}`}
                    />
                </div>
            ))}
            
        </div>
    )
};
    export default Home;