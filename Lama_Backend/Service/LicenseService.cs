using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;

namespace Lama_Backend.Service
{
    public class LicenseService
    {
        private readonly FirestoreDb _db;

        public LicenseService()
        {
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("firebase-key.json")
            });
            _db = FirestoreDb.Create("nombre-de-tu-proyecto"); // Cambia por tu projectId
        }

        public async Task<string> GenerateLicense(string userId, string plan)
        {
            string licenseKey = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

            DocumentReference docRef = _db.Collection("licenses").Document(userId);
            await docRef.SetAsync(new
            {
                licenseKey,
                plan,
                status = "active",
                expiresAt = DateTime.UtcNow.AddMonths(1) // ejemplo de 1 mes
            });

            return licenseKey;
        }

        public async Task<bool> ValidateLicense(string userId)
        {
            DocumentReference docRef = _db.Collection("licenses").Document(userId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return false;

            var data = snapshot.ToDictionary();
            if (data["status"].ToString() != "active") return false;

            DateTime expiresAt = ((Timestamp)data["expiresAt"]).ToDateTime();
            if (expiresAt < DateTime.UtcNow) return false;

            return true;
        }
    }
}
