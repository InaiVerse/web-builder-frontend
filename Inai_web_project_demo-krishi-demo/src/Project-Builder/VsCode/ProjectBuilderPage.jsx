import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProjectBuilder from './ProjectBuilder';

const ProjectBuilderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const blueprint = location.state?.blueprint;

    // Allow access even without blueprint - for opening existing projects
    // if (!blueprint) return null;

    return (
        <ProjectBuilder
            blueprint={blueprint || ''}
            onBack={() => navigate('/project-builder/chat-editor')}
        />
    );
};

export default ProjectBuilderPage;
