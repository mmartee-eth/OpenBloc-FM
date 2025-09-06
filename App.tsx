import React, { useState, useEffect, useCallback } from 'react';
import { User, Page, UserRole, Gender, Boulder } from './types';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import RefereePage from './components/RefereePage';
import { generateInitialBoulders } from './constants';

// MOCK API
const MOCK_USERS: User[] = [
    // Admin
    { id: 'admin-1', username: 'Jofre TS', email: 'jofrets@gmail.com', role: UserRole.ADMIN, gender: Gender.MALE, age: 30, completedBoulders: {'bloc-1': 1, 'bloc-7': 1, 'bloc-22': 1, 'bloc-45': { attempts: 2, isCompleted: true }} },
    // Referees
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `referee-${i + 1}`,
      username: `Arbitre ${i + 1}`,
      email: `arbitre${i + 1}@gmail.com`,
      role: UserRole.REFEREE as UserRole,
      gender: Gender.OTHER as Gender,
      age: 40 + i,
      completedBoulders: {},
    })),
    // Participant
    { id: 'participant-1', username: 'Marti Antentas', email: 'martiantentas@gmail.com', role: UserRole.PARTICIPANT, gender: Gender.MALE, age: 25, completedBoulders: {'bloc-3': 1, 'bloc-10': 1, 'bloc-46': { attempts: 1, isCompleted: false }} },
];


let MOCK_BOULDERS: Boulder[] = generateInitialBoulders();

const mockApi = {
    login: async (email: string): Promise<User | null> => {
        console.log(`Attempting login for: ${email}`);
        await new Promise(res => setTimeout(res, 500));
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
    },
    getUsers: async (): Promise<User[]> => {
        await new Promise(res => setTimeout(res, 300));
        return MOCK_USERS;
    },
    updateUser: async (updatedUser: User): Promise<User> => {
        await new Promise(res => setTimeout(res, 200));
        const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            MOCK_USERS[index] = updatedUser;
        }
        return updatedUser;
    },
    getBoulders: async (): Promise<Boulder[]> => {
        await new Promise(res => setTimeout(res, 100));
        return MOCK_BOULDERS;
    },
    updateBoulder: async (updatedBoulder: Boulder): Promise<Boulder> => {
        await new Promise(res => setTimeout(res, 150));
        const index = MOCK_BOULDERS.findIndex(b => b.id === updatedBoulder.id);
        if (index !== -1) {
            MOCK_BOULDERS[index] = updatedBoulder;
        }
        return updatedBoulder;
    }
};
// END MOCK API

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        const allUsers = await mockApi.getUsers();
        setUsers(allUsers);
    }, []);

    const fetchBoulders = useCallback(async () => {
        const allBoulders = await mockApi.getBoulders();
        setBoulders(allBoulders);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchUsers(), fetchBoulders()]).finally(() => setIsLoading(false));
    }, [fetchUsers, fetchBoulders]);


    const handleLogin = async (email: string) => {
        setLoginError(null);
        const user = await mockApi.login(email);
        if (user) {
            setCurrentUser(user);
            if (user.role === UserRole.REFEREE) {
                setCurrentPage('referee');
            } else {
                setCurrentPage('home');
            }
        } else {
            setLoginError('Credencials invàlides. Intenta amb un dels usuaris predefinits.');
        }
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
    };
    
    const handleUpdateUser = useCallback(async (updatedUserData: User | Partial<User>) => {
        if (!currentUser) return;
        
        const userToUpdate = users.find(u => u.id === updatedUserData.id) || currentUser;
        
        const fullUpdatedUser = { ...userToUpdate, ...updatedUserData } as User;

        await mockApi.updateUser(fullUpdatedUser);
        
        const latestUsers = await mockApi.getUsers();
        setUsers([...latestUsers]);

        if (currentUser.id === fullUpdatedUser.id) {
            setCurrentUser(fullUpdatedUser);
        }
    }, [currentUser, users]);

    const handleUpdateBoulder = useCallback(async (updatedBoulder: Boulder) => {
        await mockApi.updateBoulder(updatedBoulder);
        const latestBoulders = await mockApi.getBoulders();
        setBoulders([...latestBoulders]);
    }, []);

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} error={loginError} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateUser as (u:User)=>void} 
                    boulders={boulders}
                    onUpdateBoulder={handleUpdateBoulder}
                />;
            case 'leaderboard':
                return <LeaderboardPage 
                    users={users} 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateUser as (u:User)=>void}
                    boulders={boulders}
                />;
            case 'profile':
                return <ProfilePage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'referee':
                return <RefereePage
                    allUsers={users}
                    onUpdateUser={handleUpdateUser as (u:User)=>void}
                    boulders={boulders}
                />;
            default:
                return <HomePage 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateUser as (u:User)=>void} 
                    boulders={boulders}
                    onUpdateBoulder={handleUpdateBoulder}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg">
            <Navbar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage} 
                onLogout={handleLogout} 
                currentUser={currentUser} 
            />
            <main>
                {isLoading ? <div className="text-center p-8">Loading...</div> : renderPage()}
            </main>
        </div>
    );
};

export default App;