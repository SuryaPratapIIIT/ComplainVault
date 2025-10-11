"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROLES, ROLE_LABELS, setUserRole } from '@/services/roleManager';
import { useDispatch } from 'react-redux';
import { setUser } from '@/shared/store/slices/userSlice';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function SimpleRoleSelector() {
  const [selectedRole, setSelectedRole] = useState(ROLES.CITIZEN);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Set role in localStorage
      setUserRole(selectedRole);
      
      // Update Redux store with serialized user data
      if (user) {
        const serializedUser = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
          updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null
        };

        dispatch(setUser({
          user: serializedUser,
          role: selectedRole,
          permissions: getRolePermissions(selectedRole)
        }));
      }
      
      toast.success(`Welcome! Role set to ${ROLE_LABELS[selectedRole]}`);
      
      // Redirect based on role
      if (selectedRole === ROLES.POLICE) {
        router.push('/dashboard');
      } else if (selectedRole === ROLES.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRolePermissions = (role) => {
    const permissions = {
      [ROLES.CITIZEN]: ['file_complaint', 'view_own_complaints', 'track_complaint_status'],
      [ROLES.POLICE]: ['view_assigned_complaints', 'resolve_complaints', 'view_department_analytics', 'file_complaint', 'view_own_complaints'],
      [ROLES.ADMIN]: ['manage_users', 'view_all_complaints', 'assign_complaints', 'system_analytics', 'manage_departments', 'file_complaint', 'view_own_complaints', 'resolve_complaints']
    };
    return permissions[role] || permissions[ROLES.CITIZEN];
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 cosmic-particles"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">Select Your Role</h1>
        <p className="text-white/80 text-lg">
          Your role determines the features and permissions you will access within the platform.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 mb-12 max-w-6xl w-full">
        {/* Citizen Card */}
        <div 
          className={`role-card cursor-pointer transition-all duration-300 ${
            selectedRole === ROLES.CITIZEN ? 'selected' : ''
          }`}
          onClick={() => setSelectedRole(ROLES.CITIZEN)}
        >
          <div className="absolute top-4 right-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedRole === ROLES.CITIZEN ? 'bg-purple-500' : 'bg-blue-400/50'
            }`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">CITIZEN</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                As a citizen, you can file new complaints, view your complaint history, and track status of your submissions in real-time.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>File new complaints</span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>Track complaint status</span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>View your history</span>
            </div>
          </div>
        </div>

        {/* Police Officer Card */}
        <div 
          className={`role-card cursor-pointer transition-all duration-300 ${
            selectedRole === ROLES.POLICE ? 'selected' : ''
          }`}
          onClick={() => setSelectedRole(ROLES.POLICE)}
        >
          <div className="absolute top-4 right-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedRole === ROLES.POLICE ? 'bg-purple-500' : 'bg-blue-400/50'
            }`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">POLICE OFFICER</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                As a police officer, you can access your dashboard to view, manage, and resolve complaints assigned to you or your department.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>View assigned complaints</span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>Update and resolve cases</span>
              
            </div>
            <div className="flex items-center text-white/90">
              <span className="text-purple-400 mr-3">{'>'}</span>
              <span>Access department analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <form onSubmit={handleRoleSubmit} className="relative z-10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="continue-button px-12 py-4 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Setting Role...' : `${ROLE_LABELS[selectedRole]}`}
        </button>
      </form>
    </div>
  );
}
