import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import MyRecipes from './Pages/MyRecipes';
import { AuthContextComponent } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Logout from './Pages/Logout';
import AddRecipe from './Pages/AddRecipe';
import CategoryList from './Pages/CategoryList';

const App = () => {
    return (
        <AuthContextComponent>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/myrecipes' element={
                        <PrivateRoute>
                            <MyRecipes />
                        </PrivateRoute>
                    } />
                    <Route path='/addrecipe' element={
                        <PrivateRoute>
                            <AddRecipe />
                        </PrivateRoute>
                    } />
                    <Route path='/categories' element={
                        <PrivateRoute>
                            <CategoryList />
                        </PrivateRoute>
                    } />
                    <Route path='/logout' element={
                        <PrivateRoute>
                            <Logout />
                        </PrivateRoute>
                    } />
                </Routes>
            </Layout>
        </AuthContextComponent>
    );
}

export default App;