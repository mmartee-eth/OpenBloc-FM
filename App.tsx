import React, { useState, useEffect, useCallback } from 'react';
import { User, Page, UserRole, Gender, Boulder, PuntuableAttempt, BoulderDifficulty } from './types';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import ManagementPage from './components/ManagementPage';
import { DB_COLOR_TO_TAILWIND, COLOR_OPTIONS } from './constants';

// MOCK DB based on SQL schema
type DbUser = { id: string; name: string; email: string; role: UserRole; gender: Gender; category: string; dorsal?: number; };
type DbBlock = { id: number; name: string; color: string; base_points: number; is_variable: boolean; };
type DbBlockCompletion = { user_id: string; block_id: number; completed: boolean; };
type DbBlockAttempt = { user_id: string; block_id: number; completed: boolean; arbiter_id: string; };

// --- LocalStorage Persistence Logic ---
const DB_USERS_KEY = 'openbloc_db_users';
const DB_BLOCKS_KEY = 'openbloc_db_blocks';
const DB_BLOCK_COMPLETIONS_KEY = 'openbloc_db_block_completions';
const DB_BLOCK_ATTEMPTS_KEY = 'openbloc_db_block_attempts';

// Initial Data
const initialDbUsers: DbUser[] = [
    { id: 'admin-1', name: 'Jofre TS', email: 'jofrets@gmail.com', role: UserRole.ADMIN, gender: Gender.MALE, category: 'absoluta', dorsal: 1 },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `referee-${i + 1}`, name: `Arbitre ${i + 1}`, email: `arbitre${i + 1}@gmail.com`, role: UserRole.ARBITRE, gender: Gender.MALE, category: 'absoluta',
    })),
];
const initialDbBlocks: DbBlock[] = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const colors = ['verd', 'blau', 'vermell', 'groc', 'taronja', 'lila'];
    return { id, name: `Bloc ${id}`, color: colors[i % 6], base_points: 100, is_variable: id >= 45 };
});
const initialDbBlockCompletions: DbBlockCompletion[] = [
    { user_id: 'admin-1', block_id: 1, completed: true }, { user_id: 'admin-1', block_id: 7, completed: true }, { user_id: 'admin-1', block_id: 22, completed: true },
];
const initialDbBlockAttempts: DbBlockAttempt[] = [
    { user_id: 'admin-1', block_id: 45, completed: false, arbiter_id: 'referee-1' }, { user_id: 'admin-1', block_id: 45, completed: true, arbiter_id: 'referee-1' },
];

// Helper to load from localStorage or use initial data
function loadDb<T>(key: string, initialData: T): T {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    } catch (e) {
        console.error(`Error reading ${key} from localStorage`, e);
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    }
}

// Live DB variables, loaded from localStorage or initialized
let DB_USERS = loadDb<DbUser[]>(DB_USERS_KEY, initialDbUsers);
let DB_BLOCKS = loadDb<DbBlock[]>(DB_BLOCKS_KEY, initialDbBlocks);
let DB_BLOCK_COMPLETIONS = loadDb<DbBlockCompletion[]>(DB_BLOCK_COMPLETIONS_KEY, initialDbBlockCompletions);
let DB_BLOCK_ATTEMPTS = loadDb<DbBlockAttempt[]>(DB_BLOCK_ATTEMPTS_KEY, initialDbBlockAttempts);
// --- End Persistence Logic ---

// MOCK API
const mockApi = {
    login: async (email: string): Promise<User | null> => {
        await new Promise(res => setTimeout(res, 500));
        const dbUser = DB_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!dbUser) return null;
        return { ...dbUser, username: dbUser.name, completedBoulders: getCompletedBouldersForUser(dbUser.id) };
    },
    getUsers: async (): Promise<User[]> => {
        await new Promise(res => setTimeout(res, 300));
        return DB_USERS.map(dbUser => ({ ...dbUser, username: dbUser.name, completedBoulders: getCompletedBouldersForUser(dbUser.id) }));
    },
    updateUser: async (updatedUser: User): Promise<User> => {
        await new Promise(res => setTimeout(res, 200));
        const userIndex = DB_USERS.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            DB_USERS[userIndex] = { ...DB_USERS[userIndex], name: updatedUser.username };
            localStorage.setItem(DB_USERS_KEY, JSON.stringify(DB_USERS));
        }
        
        DB_BLOCK_COMPLETIONS = DB_BLOCK_COMPLETIONS.filter(c => c.user_id !== updatedUser.id);
        DB_BLOCK_ATTEMPTS = DB_BLOCK_ATTEMPTS.filter(a => a.user_id !== updatedUser.id);

        for (const blockIdStr in updatedUser.completedBoulders) {
            const blockId = parseInt(blockIdStr, 10);
            const block = DB_BLOCKS.find(b => b.id === blockId);
            if (!block) continue;
            
            const completionData = updatedUser.completedBoulders[blockIdStr];
            if (block.is_variable) {
                const attemptData = completionData as PuntuableAttempt;
                if (typeof attemptData === 'object' && attemptData.attempts > 0) {
                    for (let i = 0; i < attemptData.attempts; i++) {
                        const isAttemptCompleted = attemptData.isCompleted && (i === attemptData.attempts - 1);
                        DB_BLOCK_ATTEMPTS.push({ user_id: updatedUser.id, block_id: blockId, completed: isAttemptCompleted, arbiter_id: 'referee-1' });
                    }
                }
            } else if (completionData) {
                DB_BLOCK_COMPLETIONS.push({ user_id: updatedUser.id, block_id: blockId, completed: true });
            }
        }
        localStorage.setItem(DB_BLOCK_COMPLETIONS_KEY, JSON.stringify(DB_BLOCK_COMPLETIONS));
        localStorage.setItem(DB_BLOCK_ATTEMPTS_KEY, JSON.stringify(DB_BLOCK_ATTEMPTS));

        const dbUser = DB_USERS.find(u => u.id === updatedUser.id);
        if (!dbUser) throw new Error("User vanished after update");
        return { ...dbUser, username: dbUser.name, completedBoulders: getCompletedBouldersForUser(dbUser.id) };
    },
    getBoulders: async (): Promise<Boulder[]> => {
        await new Promise(res => setTimeout(res, 100));
        return DB_BLOCKS.map(mapDbBoulderToAppBoulder);
    },
    updateBoulder: async (updatedBoulder: Boulder): Promise<Boulder> => {
        await new Promise(res => setTimeout(res, 150));
        const index = DB_BLOCKS.findIndex(b => b.id === updatedBoulder.id);
        if (index !== -1) {
            const dbBoulder = DB_BLOCKS[index];
            dbBoulder.name = updatedBoulder.name;
            const colorName = Object.keys(DB_COLOR_TO_TAILWIND).find(key => DB_COLOR_TO_TAILWIND[key] === updatedBoulder.color) ||
                              COLOR_OPTIONS.find(c => c.class === updatedBoulder.color)?.name.toLowerCase();
            if (colorName) dbBoulder.color = colorName;
            localStorage.setItem(DB_BLOCKS_KEY, JSON.stringify(DB_BLOCKS));
        }
        return mapDbBoulderToAppBoulder(DB_BLOCKS[index]);
    }
};

const getDifficultyFromId = (id: number): BoulderDifficulty => {
    if (id >= 45) return BoulderDifficulty.PUNTUABLES;
    if (id >= 36) return BoulderDifficulty.DIFICIL;
    if (id >= 18) return BoulderDifficulty.MITJA;
    if (id >= 5) return BoulderDifficulty.FACIL;
    return BoulderDifficulty.MOLT_FACIL;
};

const mapDbBoulderToAppBoulder = (dbBoulder: DbBlock): Boulder => ({
    ...dbBoulder,
    difficulty: getDifficultyFromId(dbBoulder.id),
    color: DB_COLOR_TO_TAILWIND[dbBoulder.color] || 'bg-gray-400',
});

const getCompletedBouldersForUser = (userId: string): Record<string, PuntuableAttempt | number> => {
    const completedBoulders: Record<string, PuntuableAttempt | number> = {};
    DB_BLOCK_COMPLETIONS.filter(c => c.user_id === userId && c.completed).forEach(c => {
        completedBoulders[c.block_id] = 1;
    });
    const userAttempts = DB_BLOCK_ATTEMPTS.filter(a => a.user_id === userId);
    const attemptsByBlock = userAttempts.reduce((acc, attempt) => {
        if (!acc[attempt.block_id]) acc[attempt.block_id] = [];
        acc[attempt.block_id].push(attempt);
        return acc;
    }, {} as Record<number, DbBlockAttempt[]>);

    Object.keys(attemptsByBlock).forEach(blockIdStr => {
        const blockId = parseInt(blockIdStr, 10);
        const attempts = attemptsByBlock[blockId];
        if (attempts.length > 0) {
            const isCompleted = attempts.some(a => a.completed);
            completedBoulders[blockId] = { attempts: attempts.length, isCompleted };
        }
    });
    return completedBoulders;
};
// END MOCK API

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        // Data is now sourced from global vars which are loaded from localStorage
        const allUsers = await mockApi.getUsers();
        const allBoulders = await mockApi.getBoulders();
        setUsers(allUsers);
        setBoulders(allBoulders);
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            setIsLoading(true);
            await fetchAllData();
            const savedEmail = localStorage.getItem('loggedInUserEmail');
            if (savedEmail) {
                const user = await mockApi.login(savedEmail);
                if (user) {
                    setCurrentUser(user);
                    if (user.role === UserRole.ARBITRE) {
                        setCurrentPage('management');
                    } else {
                        setCurrentPage('home');
                    }
                } else {
                    // Clean up if the user from localStorage is no longer valid
                    localStorage.removeItem('loggedInUserEmail');
                }
            }
            setIsLoading(false);
        };
        initializeApp();
    }, [fetchAllData]);

    const handleLogin = async (email: string) => {
        setLoginError(null);
        const user = await mockApi.login(email);
        if (user) {
            localStorage.setItem('loggedInUserEmail', user.email);
            setCurrentUser(user);
            if (user.role === UserRole.ARBITRE) {
                setCurrentPage('management');
            } else {
                setCurrentPage('home');
            }
        } else {
            setLoginError('Credencials invàlides. Intenta amb un dels usuaris predefinits.');
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('loggedInUserEmail');
        setCurrentUser(null);
    };
    
    const handleUpdateUser = useCallback(async (updatedUserData: User | Partial<User>) => {
        if (!currentUser) return;
        
        const userToUpdate = users.find(u => u.id === (updatedUserData.id || currentUser.id));
        if (!userToUpdate) return;
        
        const fullUpdatedUser = { ...userToUpdate, ...updatedUserData } as User;
        const returnedUser = await mockApi.updateUser(fullUpdatedUser);
        
        await fetchAllData();

        if (currentUser.id === returnedUser.id) {
            setCurrentUser(returnedUser);
        }
    }, [currentUser, users, fetchAllData]);

    const handleUpdateBoulder = useCallback(async (updatedBoulder: Boulder) => {
        await mockApi.updateBoulder(updatedBoulder);
        const latestBoulders = await mockApi.getBoulders();
        setBoulders([...latestBoulders]);
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Carregant...</div>;
    }

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
                    boulders={boulders}
                />;
            case 'profile':
                return <ProfilePage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'management':
                return <ManagementPage
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
                {renderPage()}
            </main>
        </div>
    );
};

export default App;