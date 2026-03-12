import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

// Strict typing for the read-only customer view
interface MenuDish {
  id: string;
  dish_name: string;
  price: number;
  ingredients: string;
  fact: string;
  chef_word: string;
  glb_url: string;
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
        .select('id, dish_name, price, ingredients, fact, chef_word, glb_url')
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Our Menu</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {dishes.map((dish) => (
          <div key={dish.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{dish.dish_name}</h2>
              {/* Assuming price is stored as an integer of cents, we format it. If stored as decimal, adjust accordingly. */}
              
            </div>

            

            {/* ACTION REQUIRED: See the CTO Challenge below regarding this button */}
            <button 
              onClick={() => setActiveArDishId(dish.id)} // Open the modal
              style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                width: '100%',
                cursor: 'pointer' 
              }}
            >
              View in AR
            </button>
            
          </div>
        ))}
      </div>
      {/* --- AR Iframe Modal Overlay --- */}
      {/* --- AR Iframe Modal Overlay --- */}
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
  );
}