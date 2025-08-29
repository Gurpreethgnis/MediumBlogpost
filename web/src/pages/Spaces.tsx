import React from 'react';
import { Users, Plus, Lock, Globe } from 'lucide-react';

const Spaces: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Spaces</h1>
        <p className="text-gray-600 mt-1">Manage team-specific content areas</p>
      </div>

      <div className="text-center py-12 text-gray-500">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Spaces Feature Coming Soon</h3>
        <p className="text-gray-600">
          Create and manage team-specific spaces for organizing content and controlling access.
        </p>
        <p className="text-sm mt-2">
          You'll be able to create spaces, invite team members, and organize posts by department or project.
        </p>
      </div>
    </div>
  );
};

export default Spaces;
