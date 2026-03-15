import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './CustomerMenu.css';
// Strict typing for the read-only customer view
interface MenuDish {
  id: string;
  dish_name: string;
  price: number;
  ingredients: string;
  fact: string;
  chef_word: string;
  glb_url: string;
  image_url: string; // <-- Add this line
}

export function CustomerMenu() {
  const { restaurant_id } = useParams<{ restaurant_id: string }>();
  
  const [dishes, setDishes] = useState<MenuDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeArDishId, setActiveArDishId] = useState<string | null>(null);
  useEffect(() => {
    async function fetchMenu() {
      if (!restaurant_id) {
        setError("Invalid URL.");
        setLoading(false);
        return;
      }

      // Fetch only the necessary columns for the specific restaurant
      const { data, error: fetchError } = await supabase
        .from('dishes')
        .select('id, dish_name, price, ingredients, fact, chef_word, glb_url ,image_url')
        .eq('restaurant_id', restaurant_id);

      if (fetchError) {
        console.error("Menu fetch failed:", fetchError);
        setError("Could not load the menu at this time.");
      } else {
        setDishes(data || []);
      }
      
      setLoading(false);
    }

    fetchMenu();
  }, [restaurant_id]); // Re-run if the URL parameter changes

  if (loading) return <div style={{ padding: 20 }}>Loading menu...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (dishes.length === 0) return <div style={{ padding: 20 }}>No dishes available yet.</div>;

  // ... (Rendering logic below)
  return (
    <div
        className="menu-container"
      style={{
        minHeight: "100vh", // Ensures full screen height even with empty/small menus
        backgroundImage: "url('/finalimage.png')",
        backgroundRepeat: "repeat-y", // Tiles the image vertically without jerks
        backgroundSize: "100% auto", // Fits exact width, scales height proportionally
        backgroundPosition: "top center" // Anchors the first tile to the very top
      }}
      >
        <h1>
          Our Menu
        </h1>
        {dishes.map((dish, index) => (
          <div
            key={dish.id}
            /* Dynamically apply the 'reverse' class only to odd rows */
            className={`dish-row ${index % 2 !== 0 ? 'reverse' : ''}`}
          >
            {/* Dish Image */}
            <img
              src={dish.image_url}
              alt={dish.dish_name}
              className="dish-image"
            />

            {/* Text Content */}
            <div className="dish-info">
              <h2 
              style={{
            fontSize: "42px",
            fontWeight: "500",
            margin: 0,
            fontFamily: "serif"
          }}
              >
                {dish.dish_name}
              </h2>

              {/* View in AR Button */}
              <button
                onClick={() => setActiveArDishId(dish.id)}
                style={{
                  padding: "14px 28px",
                  background: "linear-gradient(135deg,#c84c3c,#9e2e26)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  width: "150px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
              >
                View in AR →
              </button>
            </div>
          </div>
        ))}
        <div>
           {activeArDishId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%', // Use 100% instead of 100vh to avoid mobile toolbar clipping
          backgroundColor: 'black',
          zIndex: 9999, 
        }}>
          
          {/* Floating Close Button - Absolutely positioned OVER the iframe */}
          <button 
            onClick={() => setActiveArDishId(null)} 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 10000, // Must be higher than the container
              padding: '12px 20px',
              backgroundColor: 'rgba(220, 53, 69, 0.9)', // Slight transparency looks modern
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)', // Drop shadow ensures visibility over any AR background
              backdropFilter: 'blur(4px)' // Optional: Premium glassmorphism effect
            }}
          >
            ✕ Close
          </button>

          {/* The PlayCanvas Iframe */}
          <iframe 
            src={`https://playcanv.as/p/JZ9XfrxE/?id=${activeArDishId}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              display: 'block' // Prevents default inline bottom margin
            }}
            allow="camera; xr-spatial-tracking; fullscreen" 
            title="AR Dish Viewer"
          />
        </div>
      )}
        </div>
      </div>
  );
}