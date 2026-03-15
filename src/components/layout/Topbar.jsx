import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import './Topbar.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/subjects':  'Subjects',
  '/tasks':     'Daily Tasks',
  '/calendar':  'Study Calendar',
  '/progress':  'Progress',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'StudyAI';
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        <span className="topbar-date">{today}</span>
      </div>
    </header>
  );
}
