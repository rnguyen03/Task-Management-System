import React, { useState, useContext } from 'react';
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import {DragDropContext} from 'react-beautiful-dnd'
import Column from './Column';
import Card from './Card';
import '../Styles/Home.scss'
import Navbar from "./Navbar";

const Home = () => {
  const { currentUser, endSession } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogOut = () => (
      Axios.delete("http://localhost:4000/auth/Logout", {
      }).then(response => {
          console.log(response.data);
          endSession(currentUser)
          navigate("/")
        })
        .catch(error => {
          console.error(error);
        })
  )

  const [cards, setCards] = useState(['Item 1', 'Item 2', 'Item 3'])

  const initialColumns = {
    todo: {
      id: 'todo',
      cards: ['item 1', 'item 2', 'item 3'],
    },
    doing: {
      id: 'doing',
      cards: [],
    },
    done: {
      id: 'done',
      cards: [],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;
  
    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) return null;
  
    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];
  
    console.log(`Dragged Card ID: ${start.cards[source.index]}`);
    console.log(`Source Column: ${start.id}`);
    console.log(`Destination Column: ${end.id}`);
  
  
    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      const newCards = Array.from(start.cards);
      const [removedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removedCard);
  
      const newCol = {
        ...start,
        cards: newCards,
      };
  
      setColumns(state => ({
        ...state,
        [newCol.id]: newCol,
      }));
    } else {
      // Moving between columns
      const startCards = Array.from(start.cards);
      const [removedCard] = startCards.splice(source.index, 1);
  
      const endCards = Array.from(end.cards);
      endCards.splice(destination.index, 0, removedCard);
  
      const newStartCol = {
        ...start,
        cards: startCards,
      };
  
      const newEndCol = {
        ...end,
        cards: endCards,
      };
  
      setColumns(state => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
    }
  };

  return (
    <div className="container">
        <Navbar/>
        <button onClick={handleLogOut}>Log Out</button>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="home">
            
                {Object.values(columns).map((column) => (
                <Column key={column.id} column={column} />
                ))}
            </div>
        </DragDropContext>
    </div>
  );
};

export default Home;