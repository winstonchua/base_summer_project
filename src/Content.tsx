import { Link } from 'react-router-dom';

interface ContentProps {
  selectedCategories: string[];
  items: any[];
  onDeleteItem: (id: string) => void;
  currentUserAddress: `0x${string}` | undefined;
  onItemClick: (eventId: string) => void;
}

const Content = ({ selectedCategories, items}: ContentProps) => {
  const filteredItems = selectedCategories.length === 0 ? items : items.filter(item => selectedCategories.includes(item.category));

  return (
    <div style={styles.content as React.CSSProperties}>
      {filteredItems.map((item, index) => (
        <Link to={`/event/${item.eventId}`} key={index} style={styles.itemBoxLink}>
          <div style={styles.itemBox as React.CSSProperties}>
            <img src={item.image} alt={item.name} style={styles.itemImage as React.CSSProperties} />
            <h3 style={styles.itemTitle as React.CSSProperties}>{item.name}</h3>
            <p style={styles.itemDescription as React.CSSProperties}>{item.description}</p>
            <p style={styles.itemOwner}>Owner: {item.owner}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const styles = {
  content: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '20px',
    padding: '20px',
  },
  itemBoxLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  itemBox: {
    width: '300px',
    height: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    textAlign: 'center' as 'center', 
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
  },
  itemImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as 'cover',
    borderRadius: '5px',
  },
  itemTitle: {
    fontSize: '16px',
    textDecoration: 'underline',
    margin: '10px 0',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as 'vertical',
    WebkitLineClamp: 1,
  },
  itemDescription: {
    fontSize: '14px',
    color: '#555',
    flexGrow: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as 'vertical',
    WebkitLineClamp: 3,
  },
  itemOwner: {
    fontSize: '12px',
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
};

export default Content;
