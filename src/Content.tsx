   // src/Content.tsx
   import React from 'react';

   const Content = ({ selectedCategories, items }) => {
     const filteredItems = selectedCategories.length === 0
       ? items
       : items.filter(item => selectedCategories.includes(item.category));

     return (
       <div style={styles.content}>
         {filteredItems.map((item, index) => (
           <div key={index} style={styles.itemBox}>
             <img src={item.image} alt={item.name} style={styles.itemImage} />
             <h3 style={styles.itemTitle}>{item.name}</h3>
             <p style={styles.itemDescription}>{item.description}</p>
           </div>
         ))}
       </div>
     );
   };

   const styles = {
     content: {
       display: 'flex',
       flexWrap: 'wrap',
       gap: '20px',
       padding: '20px',
     },
     itemBox: {
       width: '200px',
       padding: '20px',
       backgroundColor: '#fff',
       boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
       borderRadius: '5px',
       textAlign: 'center',
     },
     itemImage: {
       width: '100%',
       height: 'auto',
       borderRadius: '5px',
     },
     itemTitle: {
       textDecoration: 'underline',
       margin: '10px 0',
     },
     itemDescription: {
       fontSize: '14px',
       color: '#555',
     },
   };

   export default Content;
