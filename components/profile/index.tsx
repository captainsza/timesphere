// import React, { useState, useEffect } from 'react';
// import { useUser } from '@/hooks/useUser';
// import { Upload } from '@/type';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Trash2, Eye } from 'lucide-react';

// const ProfilePage: React.FC = () => {
//   const { user } = useUser();
//   const [uploads, setUploads] = useState<Upload[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchUploads();
//   }, []);

//   const fetchUploads = async () => {
//     try {
//       const response = await fetch('/api/uploads', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (response.ok) {
//         const uploadsData = await response.json();
//         setUploads(uploadsData);
//       } else {
//         throw new Error('Failed to fetch uploads');
//       }
//     } catch (err) {
//       setError('Failed to load uploads. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUpload = async (uploadId: string) => {
//     try {
//       const response = await fetch(`/api/uploads/${uploadId}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (response.ok) {
//         setUploads(uploads.filter(upload => upload.id !== uploadId));
//       } else {
//         throw new Error('Failed to delete upload');
//       }
//     } catch (err) {
//       setError('Failed to delete upload. Please try again.');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>User Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p><strong>Username:</strong> {user?.username}</p>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Level:</strong> {user?.level}</p>
//           <p><strong>Points:</strong> {user?.points}</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Your Uploads</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {uploads.length === 0 ? (
//             <p>You haven&apos;t uploaded any content yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {uploads.map(upload => (
//                 <Card key={upload.id}>
//                   <CardContent className="p-4">
//                     <img src={upload.url} alt="User upload" className="w-full h-40 object-cover mb-2 rounded" />
//                     <p className="text-sm mb-2">Uploaded on: {new Date(upload.createdAt).toLocaleDateString()}</p>
//                     <div className="flex justify-between">
//                       <Button size="sm" variant="outline" onClick={() => window.open(upload.url, '_blank')}>
//                         <Eye className="mr-2 h-4 w-4" /> View
//                       </Button>
//                       <Button size="sm" variant="destructive" onClick={() => handleDeleteUpload(upload.id)}>
//                         <Trash2 className="mr-2 h-4 w-4" /> Delete
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProfilePage;