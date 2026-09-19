
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

/* =========================================================
   LOGIN ADMINISTRATEUR
   ========================================================= */

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    onLogin(data.session);
    setLoading(false);
  }

  return (
    <div className="login-page">

      {/* Motifs africains décoratifs */}
      <div className="african-pattern pattern-one"></div>
      <div className="african-pattern pattern-two"></div>
      <div className="african-pattern pattern-three"></div>

      <div className="login-card">

        <div className="login-decoration">
          ◆ ◇ ◆
        </div>

        <div className="login-icon">
          🎂
        </div>

        <h1>Birthday Surprise</h1>

        <p className="login-subtitle">
          Espace administrateur
        </p>

        <div className="login-pattern-line">
          ◆ ◇ ◆ ◇ ◆
        </div>

        <form onSubmit={handleLogin}>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Mot de passe
          </label>

          <input
            id="password"
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        <div className="login-bottom-pattern">
          ◇ ◆ ◇ ◆ ◇
        </div>

      </div>
    </div>
  );
}

/* AJOUTER ICI AddGuestModal */

function AddGuestModal({ tables, onClose, onGuestAdded }) {
  const [name, setName] = useState("");
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAddGuest(e) {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Veuillez saisir le nom de l'invité.");
      return;
    }

    if (!tableId) {
      setError("Veuillez sélectionner une table.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("guests")
      .insert([
        {
          display_name: cleanName,
          table_id: tableId,
          has_arrived: false,
          arrived_at: null,
        },
      ])
      .select("id, display_name, has_arrived, arrived_at, table_id")
      .single();

    if (error) {
      console.error(error);
      setError("Impossible d'ajouter cet invité.");
      setLoading(false);
      return;
    }

    onGuestAdded(data);

    setLoading(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">NOUVEL INVITÉ</p>
            <h2>Ajouter un invité</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>



        <form onSubmit={handleAddGuest}>

          <div className="form-group">
            <label>Nom de l'invité</label>

            <input
              type="text"
              placeholder="Ex. Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Numéro de table</label>

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">
                Sélectionner une table
              </option>

              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                >
                  Table {table.table_number}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Ajout..."
                : "Ajouter l'invité"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


function EditGuestModal({ guest, tables, onClose, onGuestUpdated }) {
  const [name, setName] = useState(guest.display_name);
  const [tableId, setTableId] = useState(guest.table_id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  async function handleUpdateGuest(e) {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Veuillez saisir le nom de l'invité.");
      return;
    }

    if (!tableId) {
      setError("Veuillez sélectionner une table.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("guests")
      .update({
        display_name: cleanName,
        table_id: tableId,
      })
      .eq("id", guest.id)
      .select(
        "id, display_name, has_arrived, arrived_at, table_id"
      )
      .single();

    if (error) {
      console.error(error);
      setError("Impossible de modifier cet invité.");
      setLoading(false);
      return;
    }

    onGuestUpdated(data);

    setLoading(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">MODIFIER L'INVITÉ</p>
            <h2>Modifier un invité</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdateGuest}>

          <div className="form-group">
            <label>Nom de l'invité</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Numéro de table</label>

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">
                Sélectionner une table
              </option>

              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                >
                  Table {table.table_number}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

function TableModal({
  table,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(table);

  const [tableNumber, setTableNumber] = useState(
    table ? String(table.table_number) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanNumber = tableNumber.trim();

    if (!cleanNumber) {
      setError("Veuillez saisir un numéro de table.");
      return;
    }

    if (!/^\d+$/.test(cleanNumber)) {
      setError("Le numéro de table doit être un nombre.");
      return;
    }

    setLoading(true);
    setError("");

    const success = await onSave(
      isEditing ? table : null,
      cleanNumber
    );

    if (!success) {
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="modal-card"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">
              {isEditing
                ? "MODIFIER LA TABLE"
                : "NOUVELLE TABLE"}
            </p>

            <h2>
              {isEditing
                ? "Modifier une table"
                : "Ajouter une table"}
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Numéro de table
            </label>

            <input
              type="number"
              min="1"
              placeholder="Ex. 17"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(e.target.value)
              }
              autoFocus
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                ? "Enregistrer"
                : "Ajouter la table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteTableModal({
  table,
  onClose,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");

    const success = await onConfirm(table);

    if (!success) {
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="modal-card"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="modal-kicker">
              SUPPRESSION
            </p>

            <h2>
              Supprimer la table
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p>
          Voulez-vous vraiment supprimer la{" "}
          <strong>
            Table {table.table_number}
          </strong>{" "}
          ?
        </p>

        <p>
          Cette action supprimera uniquement la
          table. Une table contenant encore des
          invités ne pourra pas être supprimée.
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>

          <button
            type="button"
            className="arrival-button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading
              ? "Suppression..."
              : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}


function GuestPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [guestMessage, setGuestMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");

  const [view, setView] = useState("welcome");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  
  

  async function loadGallery() {
  setGalleryLoading(true);
  setGalleryError("");

 const { data, error } = await supabase
  .from("gallery")
  .select(`
  id,
  photo_url,
  created_at,
  guest_id,
  storage_path,
  delete_token,
  gallery_reactions (
    id,
    guest_id
  )
`)
  .order("created_at", {
    ascending: false,
  });

  setGalleryLoading(false);

  if (error) {
    console.error("Gallery loading error:", error);

    setGalleryError(
      "Impossible de charger la galerie pour le moment."
    );

    return;
  }

  const photosWithReactions = (data || []).map(
  (photo) => ({
    ...photo,
    reactions: photo.gallery_reactions || [],
  })
);

setGalleryPhotos(photosWithReactions);
}

  async function handleDownloadGalleryPhoto(photo) {
  if (!photo?.storage_path) {
    console.error(
      "Impossible de télécharger : storage_path manquant."
    );

    return;
  }

  try {
    const { data, error } =
      await supabase.storage
        .from("birthday-photos")
        .download(photo.storage_path);

    if (error) {
      console.error(
        "Guest photo download error:",
        error
      );

      setGalleryError(
        "Impossible d'enregistrer cette photo. Veuillez réessayer."
      );

      return;
    }

    const fileExtension =
      photo.storage_path
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const blobUrl =
      URL.createObjectURL(data);

    const link =
      document.createElement("a");

    link.href = blobUrl;

    link.download =
      `souvenir-anniversaire-${photo.id}.${fileExtension}`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(
      "Unexpected guest photo download error:",
      error
    );

    setGalleryError(
      "Une erreur est survenue pendant l'enregistrement."
    );
  }
}

async function handleDownloadAllGalleryPhotos() {
  if (!galleryPhotos.length) {
    return;
  }

  setGalleryError("");

  for (const photo of galleryPhotos) {
    await handleDownloadGalleryPhoto(photo);

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );
  }
}

  async function handleSendMessage(event) {
  event.preventDefault();

  if (!selectedGuest?.id) {
    return;
  }

  const cleanedMessage = guestMessage.trim();

  if (!cleanedMessage) {
    return;
  }

  if (cleanedMessage.length > 1000) {
    setMessageSuccess("");
    return;
  }

  setSendingMessage(true);
  setMessageSuccess("");

  try {
    const { error } = await supabase
      .from("messages")
      .insert({
        guest_id: selectedGuest.id,
        message: cleanedMessage,
      });

    if (error) {
      console.error("Message sending error:", error);
      setMessageSuccess("");
      return;
    }

    setGuestMessage("");
    setMessageSuccess(
      "💌 Votre message a bien été envoyé à Bruno."
    );
  } catch (error) {
    console.error(
      "Unexpected message sending error:",
      error
    );
    setMessageSuccess("");
  } finally {
    setSendingMessage(false);
  }
}


function openGallery() {
  setView("gallery");
  loadGallery();
  window.location.hash = "gallery";
}

function closeGallery() {
  setView("welcome");
  window.location.hash = "";
}

  async function handleReaction(photo) {
  if (!selectedGuest?.id) {
    return;
  }

  const reactions = photo.reactions || [];

  const existingReaction = reactions.find(
    (reaction) => reaction.guest_id === selectedGuest.id
  );

  try {
    // ❤️ La personne a déjà aimé → retirer son cœur
    if (existingReaction) {
      const { error } = await supabase
        .from("gallery_reactions")
        .delete()
        .eq("id", existingReaction.id);

      if (error) {
        console.error("Remove reaction error:", error);

        setGalleryError(
          "Impossible de retirer votre réaction."
        );

        return;
      }

      // Mise à jour immédiate de la galerie
      setGalleryPhotos((currentPhotos) =>
        currentPhotos.map((currentPhoto) => {
          if (currentPhoto.id !== photo.id) {
            return currentPhoto;
          }

          return {
            ...currentPhoto,
            reactions: (currentPhoto.reactions || []).filter(
              (reaction) =>
                reaction.id !== existingReaction.id
            ),
          };
        })
      );

      return;
    }

    // 🤍 La personne n'a pas encore aimé → ajouter son cœur
    const { data: newReaction, error } = await supabase
      .from("gallery_reactions")
      .insert({
        photo_id: photo.id,
        guest_id: selectedGuest.id,
      })
      .select("id, photo_id, guest_id")
      .single();

    if (error) {
      console.error("Add reaction error:", error);

      setGalleryError(
        "Impossible d'ajouter votre réaction."
      );

      return;
    }

    // Mise à jour immédiate de la galerie
    setGalleryPhotos((currentPhotos) =>
      currentPhotos.map((currentPhoto) => {
        if (currentPhoto.id !== photo.id) {
          return currentPhoto;
        }

        return {
          ...currentPhoto,
          reactions: [
            ...(currentPhoto.reactions || []),
            newReaction,
          ],
        };
      })
    );
  } catch (error) {
    console.error(
      "Unexpected reaction error:",
      error
    );

    setGalleryError(
      "Une erreur est survenue avec la réaction."
    );
  }
}

  async function handlePhotoUpload(event) {
  const files = Array.from(event.target.files || []);

  if (!selectedGuest?.id || files.length === 0) {
    return;
  }

  setUploadingPhoto(true);
  setUploadError("");

  try {
    const uploadedPhotos = [];

    for (const file of files) {
      // Vérification du type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          `Le fichier "${file.name}" n'est pas une image compatible.`
        );
        continue;
      }

      // Limite de 10 MB par photo
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(
          `La photo "${file.name}" dépasse la limite de 10 MB.`
        );
        continue;
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath =
        `${selectedGuest.id}/${crypto.randomUUID()}.${extension}`;

      // Upload vers Supabase Storage
      const { error: uploadError } =
        await supabase.storage
          .from("birthday-photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        console.error(
          `Upload error for ${file.name}:`,
          uploadError
        );

        setUploadError(
          `Impossible d'ajouter "${file.name}".`
        );

        continue;
      }

      // URL publique
      const { data: publicUrlData } =
        supabase.storage
          .from("birthday-photos")
          .getPublicUrl(filePath);

      const photoUrl =
        publicUrlData?.publicUrl;

      if (!photoUrl) {
        console.error(
          "Impossible de récupérer l'URL publique:",
          filePath
        );

        continue;
      }

      // Enregistrer la photo dans gallery
      const { data: galleryPhoto, error: galleryError } =
        await supabase
          .from("gallery")
          .insert({
            guest_id: selectedGuest.id,
            storage_path: filePath,
            photo_url: photoUrl,
          })
          .select(
            "id, photo_url, created_at, guest_id, storage_path, delete_token"
          )
          .single();

      if (galleryError) {
        console.error(
          `Gallery insert error for ${file.name}:`,
          galleryError
        );

        // Si l'enregistrement gallery échoue,
        // on supprime aussi le fichier du Storage.
        await supabase.storage
          .from("birthday-photos")
          .remove([filePath]);

        setUploadError(
          `Impossible d'enregistrer "${file.name}".`
        );

        continue;
      }

      uploadedPhotos.push({
        ...galleryPhoto,
        reactions: [],
      });
    }

    // Ajouter toutes les nouvelles photos
    // immédiatement dans la galerie
    if (uploadedPhotos.length > 0) {
      setGalleryPhotos((currentPhotos) => [
        ...uploadedPhotos,
        ...currentPhotos,
      ]);
    }

    // Message de succès
    if (uploadedPhotos.length === files.length) {
      setUploadError("");
    }
  } catch (error) {
    console.error(
      "Unexpected upload error:",
      error
    );

    setUploadError(
      "Une erreur est survenue pendant l'ajout des photos."
    );
  } finally {
    setUploadingPhoto(false);

    // Permet de sélectionner à nouveau
    // les mêmes photos plus tard
    event.target.value = "";
  }

  async function downloadPhoto(photoUrl, fileName = "photo-anniversaire.jpg") {
  try {
    const response = await fetch(photoUrl);

    if (!response.ok) {
      throw new Error("Impossible de télécharger la photo.");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Erreur téléchargement photo:", error);
    alert("Impossible d'enregistrer la photo sur le téléphone.");
  }
}
}

  function handleDeletePhoto(photo) {
  if (!selectedGuest?.id) {
    return;
  }

  // Sécurité côté interface
  if (photo.guest_id !== selectedGuest.id) {
    setGalleryError(
      "Vous ne pouvez supprimer que vos propres photos."
    );
    return;
  }

  if (!photo.delete_token) {
    setGalleryError(
      "Cette photo ne peut pas être supprimée."
    );
    return;
  }

  // On ouvre simplement la modal.
  // La suppression ne se fera qu'après confirmation.
  setGalleryError("");
  setPhotoToDelete(photo);
}

  async function confirmDeletePhoto() {
  if (!photoToDelete || !selectedGuest?.id) {
    return;
  }

  const photo = photoToDelete;

  setDeletingPhotoId(photo.id);
  setGalleryError("");

  try {
    const { data, error } =
      await supabase.functions.invoke(
        "delete-gallery-photo",
        {
          body: {
            photo_id: photo.id,
            guest_id: selectedGuest.id,
            delete_token: photo.delete_token,
          },
        }
      );

    console.log("DELETE PHOTO - data:", data);
    console.log("DELETE PHOTO - error:", error);

    if (error) {
      console.error(
        "DELETE PHOTO ERROR COMPLET:",
        error
      );

      setGalleryError(
        error.message ||
          error.context?.message ||
          "Impossible de supprimer cette photo. Veuillez réessayer."
      );

      return;
    }

    if (!data?.success) {
      setGalleryError(
        data?.error ||
          "La suppression de la photo a échoué."
      );

      return;
    }

    console.log(
      "DELETE PHOTO SUCCESS:",
      data
    );

    // Retirer uniquement la photo supprimée
    // sans recharger toute la galerie.
    setGalleryPhotos((currentPhotos) =>
      currentPhotos.filter(
        (item) => item.id !== photo.id
      )
    );

    // Fermer la modal
    setPhotoToDelete(null);

    // Effacer un éventuel ancien message
    setGalleryError("");
  } catch (error) {
    console.error(
      "Unexpected delete error:",
      error
    );

    setGalleryError(
      "Une erreur est survenue pendant la suppression."
    );
  } finally {
    setDeletingPhotoId(null);
  }
}

function cancelDeletePhoto() {
  if (deletingPhotoId) {
    return;
  }

  setPhotoToDelete(null);
}

  async function handleSearch(e) {
    e.preventDefault();

    const cleanSearch = search.trim();

    if (cleanSearch.length < 2) {
      setError("Veuillez saisir au moins 2 caractères.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setSelectedGuest(null);

    const { data, error } = await supabase.rpc(
      "search_public_guests",
      {
        search_text: cleanSearch,
      }
    );

    setLoading(false);

    if (error) {
      console.error("Guest search error:", error);
      setError(
        "Impossible d'effectuer la recherche pour le moment."
      );
      setResults([]);
      return;
    }

    setResults(data || []);

    if (!data || data.length === 0) {
      setError(
        "Aucun invité ne correspond à cette recherche."
      );
    }
  }

  async function handleSelectGuest(guest) {
  setLoading(true);
  setError("");

  try {
    // 1. Récupérer les informations publiques de l'invité
    const { data, error } = await supabase.rpc(
      "get_public_guest",
      {
        guest_id: guest.id,
      }
    );

    if (error) {
      console.error("Guest selection error:", error);
      setError(
        "Impossible de récupérer les informations de cet invité."
      );
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "Les informations de cet invité sont introuvables."
      );
      return;
    }

    const guestData = data[0];

    // 2. Normaliser l'identifiant de l'invité
    const normalizedGuest = {
      ...guestData,
      id: guestData.id ?? guestData.guest_id ?? guest.id,
    };

    console.log("Selected guest:", normalizedGuest);
    console.log("Selected guest ID:", normalizedGuest.id);

    // 3. Marquer automatiquement l'invité comme arrivé
    const { error: arrivalError } = await supabase.rpc(
      "mark_guest_arrived",
      {
        p_guest_id: normalizedGuest.id,
      }
    );

    if (arrivalError) {
      console.error(
        "Guest arrival registration error:",
        arrivalError
      );

      setError(
        "Impossible d'enregistrer votre arrivée. Veuillez réessayer."
      );

      return;
    }

    console.log(
      "Guest automatically marked as arrived:",
      normalizedGuest.id
    );

    // 4. Afficher la page personnelle de l'invité
    setSelectedGuest({
      ...normalizedGuest,
      has_arrived: true,
    });

    setResults([]);
  } catch (error) {
    console.error(
      "Unexpected guest selection error:",
      error
    );

    setError(
      "Une erreur est survenue. Veuillez réessayer."
    );
  } finally {
    setLoading(false);
  }
}

  function handleReset() {
    setSearch("");
    setResults([]);
    setSelectedGuest(null);
    setError("");
  }

  return (
    <div className="guest-page">

      {photoToDelete && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <div className="delete-modal-icon">
        🗑️
      </div>

      <div className="delete-modal-decoration">
        ◆ ◇ ◆
      </div>

      <h2>Supprimer cette photo ?</h2>

      <p>
        Cette photo sera définitivement retirée
        de la galerie.
      </p>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="delete-modal-cancel"
          onClick={cancelDeletePhoto}
          disabled={deletingPhotoId === photoToDelete.id}
        >
          Annuler
        </button>

        <button
          type="button"
          className="delete-modal-confirm"
          onClick={confirmDeletePhoto}
          disabled={deletingPhotoId === photoToDelete.id}
        >
          {deletingPhotoId === photoToDelete.id
            ? "Suppression..."
            : "Supprimer"}
        </button>
      </div>
    </div>
  </div>
)}
      {/* Motifs africains décoratifs */}
      <div className="african-shape african-shape-one"></div>
      <div className="african-shape african-shape-two"></div>
      <div className="african-shape african-shape-three"></div>
      <div className="african-shape african-shape-four"></div>

      <div className="guest-pattern guest-pattern-left">
        ◆
        <span>◇</span>
        ◆
        <span>◇</span>
        ◆
      </div>

      <div className="guest-pattern guest-pattern-right">
        ◇
        <span>◆</span>
        ◇
        <span>◆</span>
        ◇
      </div>

      <div className="guest-card">

  {view === "gallery" ? (
    <div className="guest-gallery">

      <div className="gallery-top-decoration">
        <span>◇</span>
        <span>◆</span>
        <span>◇</span>
      </div>

      <p className="guest-kicker">
        SOUVENIRS DE LA FÊTE
      </p>

      <h1 className="gallery-title">
        La galerie
      </h1>

      <div className="guest-divider">
        <span></span>
        ◆
        <span></span>
      </div>

      <p className="gallery-intro">
        Découvrez les beaux moments partagés
        pendant cette journée spéciale.
      </p>

      {galleryLoading ? (
  <div className="gallery-empty">
    <div className="gallery-loading-icon">
      ✦
    </div>

    <p>
      Chargement des souvenirs...
    </p>
  </div>
) : galleryPhotos.length === 0 ? (
        <div className="gallery-empty">

          <div className="gallery-empty-icon">
            📸
          </div>

          <h3>
            La galerie est encore vide
          </h3>

          <p>
            Les premières photos de la fête
            apparaîtront ici.
          </p>

          {galleryPhotos.length > 0 && (
  <button
    type="button"
    className="guest-download-all-button"
    onClick={handleDownloadAllGalleryPhotos}
  >
    ↓ Enregistrer toutes les photos
  </button>
)}

        </div>
      ) : (
        
        <div className="gallery-grid">

          {galleryPhotos.map((photo) => {
            const reactions = photo.reactions || [];
            const hasReacted = selectedGuest
            ? reactions.some(
              (reaction) =>
                reaction.guest_id === selectedGuest.id
            )
            : false;
             return (
               <div
               className="gallery-photo-card"
               key={photo.id}
               >
      <img
        src={photo.photo_url}
        alt="Souvenir de la fête"
        loading="lazy"
      />

      <button
  type="button"
  onClick={() =>
    downloadPhoto(
      photo.photo_url,
      `birthday-${photo.id}.jpg`
    )
  }
>
  📥 Enregistrer dans ma galerie
</button>

      <button
  type="button"
  className="guest-download-photo-button"
  onClick={() =>
    handleDownloadGalleryPhoto(photo)
  }
  title="Enregistrer cette photo"
>
  ↓
</button>

      <div className="photo-actions">

  <button
    type="button"
    className={
      hasReacted
        ? "reaction-button reacted"
        : "reaction-button"
    }
    onClick={() => handleReaction(photo)}
  >
    <span>
      {hasReacted ? "♥" : "♡"}
    </span>
    {reactions.length}
  </button>

  {selectedGuest &&
    photo.guest_id === selectedGuest.id && (
      <button
        type="button"
        className="delete-photo-button"
        onClick={() => handleDeletePhoto(photo)}
        disabled={deletingPhotoId === photo.id}
        title="Supprimer ma photo"
      >
        {deletingPhotoId === photo.id
          ? "⏳"
          : "🗑️"}
      </button>
    )}
    </div>
  </div>
  );
})}

</div>
)}

<div className="gallery-actions">

  <div className="photo-upload-area">

    <input
    id="gallery-photo-input"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    multiple
    onChange={handlePhotoUpload}
    />

    <label
      htmlFor="gallery-photo-input"
      className="gallery-button"
    >
      <span>
        {uploadingPhoto ? "⏳" : "＋"}
      </span>

      {uploadingPhoto
        ? "Envoi de la photo..."
        : "Ajouter une photo"}

      {!uploadingPhoto && (
        <span>→</span>
      )}
    </label>

    {uploadError && (
      <div className="form-error">
        {uploadError}
      </div>
    )}

  </div>

  <button
    type="button"
    className="back-search-button"
    onClick={closeGallery}
  >
    ← Retour à mon accueil
  </button>

</div>
<div className="welcome-footer">
  <span>✦</span>

  <p>
    Chaque photo raconte un souvenir
  </p>

  <span>✦</span>
  </div>
  </div>
    ) : !selectedGuest ? (
          <>
            <div className="guest-logo">
              <span>✦</span>
              <strong>B</strong>
              <span>✦</span>
            </div>

            <div className="guest-header">
              <p className="guest-kicker">
                UNE JOURNÉE EXCEPTIONNELLE
              </p>

              <h1>
                Bienvenue
              </h1>

              <div className="guest-divider">
                <span></span>
                ◆
                <span></span>
              </div>

              <p className="guest-intro">
                Nous sommes ravis de vous compter
                parmi les invités.
              </p>

              <p className="guest-instruction">
                Recherchez votre nom pour découvrir
                votre table et accéder à votre espace.
              </p>
            </div>

            <form
              className="guest-search-form"
              onSubmit={handleSearch}
            >
              <div className="guest-input-wrapper">
                <span className="guest-input-icon">
                  ♡
                </span>

                <input
                  type="text"
                  placeholder="Entrez votre nom"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  autoFocus
                />
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="guest-main-button"
                disabled={loading}
              >
                {loading
                  ? "Recherche..."
                  : "Rechercher mon nom"}
                <span>→</span>
              </button>
            </form>

            {results.length > 0 && (
              <div className="guest-results">
                <div className="guest-results-title">
                  <span>✦</span>
                  Sélectionnez votre nom
                  <span>✦</span>
                </div>

                {results.map((guest) => (
                  <button
                    key={guest.id}
                    type="button"
                    className="guest-result-item"
                    onClick={() =>
                      handleSelectGuest(guest)
                    }
                  >
                    <span className="result-avatar">
                      {guest.display_name
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span>
                      {guest.display_name}
                    </span>

                    <span className="result-arrow">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="guest-footer-decoration">
              <span>◆</span>
              <span>◇</span>
              <span>◆</span>
              <span>◇</span>
              <span>◆</span>
            </div>
          </>
        ) : (
          <div className="guest-welcome">

            <div className="welcome-confetti">
              <span>✦</span>
              <span>◆</span>
              <span>✧</span>
              <span>◇</span>
              <span>✦</span>
            </div>

            <div className="welcome-icon">
              🎉
            </div>

            <p className="guest-kicker">
              VOUS ÊTES BIEN ARRIVÉ(E)
            </p>

            <h1>
              Bienvenue
            </h1>

            <h2>
              {selectedGuest.display_name}
            </h2>

            <div className="guest-divider">
              <span></span>
              ◆
              <span></span>
            </div>

            <p className="welcome-message">
              C'est un plaisir de vous avoir
              parmi nous pour célébrer
              cette journée spéciale.
            </p>

            <div className="table-card">
              <div className="table-card-pattern">
                ◆ ◇ ◆ ◇ ◆
              </div>

              <p>
                VOTRE TABLE
              </p>

              <strong>
                {selectedGuest.table_number
                  ? selectedGuest.table_number
                  : "—"}
              </strong>

              <span>
                Table
              </span>
            </div>

            <div className="guest-actions">

              <button
                type="button"
                className="gallery-button"
                onClick={openGallery}
              >
                <span>📸</span>
                Découvrir la galerie
                <span>→</span>
              </button>

              <section className="guest-message-section">
  <div className="guest-message-decoration">
    ✦ ◆ ✦
  </div>

  <div className="guest-message-header">
    <span className="guest-message-icon">💌</span>

    <div>
      <h3>Un petit mot pour Bruno</h3>
      <p>
        Laissez-lui un message pour lui souhaiter un joyeux anniversaire.
      </p>
    </div>
  </div>

  <form
    className="guest-message-form"
    onSubmit={handleSendMessage}
  >
    <textarea
      value={guestMessage}
      onChange={(event) => {
        setGuestMessage(event.target.value);
        setMessageSuccess("");
      }}
      placeholder="Écrivez votre message ici..."
      maxLength={1000}
      rows={5}
      disabled={sendingMessage}
    />

    <div className="guest-message-footer">
      <span className="guest-message-counter">
        {guestMessage.length}/1000
      </span>

      <button
        type="submit"
        className="guest-message-button"
        disabled={
          sendingMessage ||
          guestMessage.trim().length === 0
        }
      >
        {sendingMessage
          ? "Envoi..."
          : "Envoyer mon message 💌"}
      </button>
    </div>

    {messageSuccess && (
      <div className="guest-message-success">
        {messageSuccess}
      </div>
    )}
  </form>
</section>

              <button
                type="button"
                className="back-search-button"
                onClick={handleReset}
              >
                ← Rechercher un autre nom
              </button>

            </div>

            <div className="welcome-footer">
              <span>✦</span>
              <p>
                Profitez pleinement de la fête
              </p>
              <span>✦</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}


/* =========================================================
   DASHBOARD
   ========================================================= */


function Dashboard({ session }) {
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);

  const [showAddTable, setShowAddTable] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deletingTable, setDeletingTable] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [deletingMessage, setDeletingMessage] = useState(null);

  const [adminView, setAdminView] = useState("guests");
  

async function toggleArrival(guest) {
  const newStatus = !guest.has_arrived;

  const { data, error } = await supabase
    .from("guests")
    .update({
      has_arrived: newStatus,
      arrived_at: newStatus
        ? new Date().toISOString()
        : null,
    })
    .eq("id", guest.id)
    .select(
      "id, display_name, has_arrived, arrived_at, table_id"
    )
    .single();

  if (error) {
    console.error("Arrival update error:", error);
    setError(
      "Impossible de modifier le statut d'arrivée : " +
        error.message
    );
    return;
  }

  setGuests((currentGuests) =>
    currentGuests.map((item) =>
      item.id === guest.id ? data : item
    )
  );
}



  function handleGuestUpdated(updatedGuest) {
  setGuests((currentGuests) =>
    currentGuests
      .map((guest) =>
        guest.id === updatedGuest.id
          ? updatedGuest
          : guest
      )
      .sort((a, b) =>
        a.display_name.localeCompare(b.display_name, "fr")
      )
  );
}

function handleGuestAdded(newGuest) {
  setGuests((currentGuests) =>
    [...currentGuests, newGuest].sort((a, b) =>
      a.display_name.localeCompare(b.display_name, "fr")
    )
  );
}

async function loadMessages() {
  setMessagesLoading(true);

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        guest_id,
        message,
        created_at,
        guests (
          id,
          display_name,
          first_name,
          last_name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Messages loading error:",
        error
      );

      setError(
        "Impossible de charger les messages : " +
          error.message
      );

      setMessages([]);
      return;
    }

    console.log(
      "ADMIN MESSAGES:",
      data
    );

    setMessages(data || []);
  } catch (error) {
    console.error(
      "Unexpected messages error:",
      error
    );

    setError(
      "Une erreur est survenue pendant le chargement des messages."
    );

    setMessages([]);
  } finally {
    setMessagesLoading(false);
  }
}

async function handleDeleteMessage(message) {
  if (!message?.id) {
    return;
  }

  const confirmed = window.confirm(
    "Voulez-vous vraiment supprimer ce message ?"
  );

  if (!confirmed) {
    return;
  }

  setDeletingMessage(message.id);
  setError("");

  try {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", message.id);

    if (error) {
      console.error(
        "Message deletion error:",
        error
      );

      setError(
        "Impossible de supprimer le message : " +
          error.message
      );

      return;
    }

    setMessages((currentMessages) =>
      currentMessages.filter(
        (item) => item.id !== message.id
      )
    );
  } catch (error) {
    console.error(
      "Unexpected message deletion error:",
      error
    );

    setError(
      "Une erreur est survenue pendant la suppression."
    );
  } finally {
    setDeletingMessage(null);
  }
}


  /* =======================================================
     CHARGEMENT DES DONNÉES
     ======================================================= */

  async function loadData() {
    setLoading(true);
    setError("");

    const {
      data: guestsData,
      error: guestsError,
    } = await supabase
      .from("guests")
      .select(
        "id, display_name, has_arrived, arrived_at, table_id"
      )
      .order("display_name");

    if (guestsError) {
      console.error("Guests error:", guestsError);

      setError(
        "Impossible de charger les invités : " +
          guestsError.message
      );

      setLoading(false);
      return;
    }

    const {
      data: tablesData,
      error: tablesError,
    } = await supabase
      .from("tables")
      .select("id, table_number")
      .order("table_number");

    if (tablesError) {
      console.error("Tables error:", tablesError);

      setError(
        "Impossible de charger les tables : " +
          tablesError.message
      );

      setLoading(false);
      return;
    }

    setGuests(guestsData || []);
    setTables(tablesData || []);

    await loadMessages();

    setLoading(false);
  }

  const filteredMessages = messages.filter(
  (item) => {
    const guest = item.guests || {};

    const guestName =
      guest.display_name ||
      [guest.first_name, guest.last_name]
        .filter(Boolean)
        .join(" ") ||
      "Invité inconnu";

    const searchText =
      `${guestName} ${item.message}`.toLowerCase();

    return searchText.includes(
      messageSearch.toLowerCase().trim()
    );
  }
);


  /* =======================================================
     INITIALISATION
     ======================================================= */

  useEffect(() => {
    loadData();
  }, []);


  /* =======================================================
     DÉCONNEXION
     ======================================================= */

  async function handleLogout() {
    await supabase.auth.signOut();
  }


  /* =======================================================
     STATISTIQUES
     ======================================================= */

  const totalGuests = guests.length;

  const arrivedCount = guests.filter(
    (guest) => guest.has_arrived
  ).length;

  const waitingCount = totalGuests - arrivedCount;

  const arrivalRate =
    totalGuests > 0
      ? Math.round((arrivedCount / totalGuests) * 100)
      : 0;


  /* =======================================================
     RECHERCHE
     ======================================================= */

  const filteredGuests = guests.filter((guest) =>
    guest.display_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  /* =======================================================
     NUMÉRO DE TABLE
     ======================================================= */

  function getTableNumber(tableId) {
    const table = tables.find(
      (item) => item.id === tableId
    );

    return table ? table.table_number : "—";
  }

  function getTableStats(tableId) {
  const tableGuests = guests.filter(
    (guest) => guest.table_id === tableId
  );

  const arrived = tableGuests.filter(
    (guest) => guest.has_arrived
  ).length;

  return {
    total: tableGuests.length,
    arrived,
  };
}

async function handleAddTable(tableNumber) {
  const cleanNumber = String(tableNumber).trim();

  if (!cleanNumber) {
    setError("Veuillez saisir un numéro de table.");
    return false;
  }

  if (!/^\d+$/.test(cleanNumber)) {
    setError("Le numéro de table doit être un nombre.");
    return false;
  }

  const numberExists = tables.some(
    (table) =>
      String(table.table_number) === cleanNumber
  );

  if (numberExists) {
    setError("Cette table existe déjà.");
    return false;
  }

  setError("");

  const { data, error } = await supabase
    .from("tables")
    .insert([
      {
        table_number: Number(cleanNumber),
      },
    ])
    .select("id, table_number")
    .single();

  if (error) {
    console.error("Add table error:", error);
    setError(
      "Impossible d'ajouter la table : " +
        error.message
    );
    return false;
  }

  setTables((currentTables) =>
    [...currentTables, data].sort(
      (a, b) =>
        Number(a.table_number) -
        Number(b.table_number)
    )
  );

  return true;
}

async function handleEditTable(table, newNumber) {
  const cleanNumber = String(newNumber).trim();

  if (!cleanNumber) {
    setError("Veuillez saisir un numéro de table.");
    return false;
  }

  if (!/^\d+$/.test(cleanNumber)) {
    setError("Le numéro de table doit être un nombre.");
    return false;
  }

  const numberExists = tables.some(
    (item) =>
      item.id !== table.id &&
      String(item.table_number) === cleanNumber
  );

  if (numberExists) {
    setError("Cette table existe déjà.");
    return false;
  }

  setError("");

  const { data, error } = await supabase
    .from("tables")
    .update({
      table_number: Number(cleanNumber),
    })
    .eq("id", table.id)
    .select("id, table_number")
    .single();

  if (error) {
    console.error("Edit table error:", error);
    setError(
      "Impossible de modifier la table : " +
        error.message
    );
    return false;
  }

  setTables((currentTables) =>
    currentTables
      .map((item) =>
        item.id === table.id ? data : item
      )
      .sort(
        (a, b) =>
          Number(a.table_number) -
          Number(b.table_number)
      )
  );

  return true;
}

async function handleDeleteTable(table) {
  const stats = getTableStats(table.id);

  if (stats.total > 0) {
    setError(
      `Impossible de supprimer la Table ${table.table_number} : ${stats.total} invité(s) y sont encore associé(s).`
    );
    return false;
  }

  setError("");

  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", table.id);

  if (error) {
    console.error("Delete table error:", error);
    setError(
      "Impossible de supprimer la table : " +
        error.message
    );
    return false;
  }

  setTables((currentTables) =>
    currentTables.filter(
      (item) => item.id !== table.id
    )
  );

  return true;
}



  /* =======================================================
     INTERFACE
     ======================================================= */

  return (
    <div className="dashboard">

      {/* Motifs africains */}
      <div className="african-pattern pattern-one"></div>
      <div className="african-pattern pattern-two"></div>
      <div className="african-pattern pattern-three"></div>

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-symbol">
            ◆
          </div>

          <div>
            <h1>
              Birthday Surprise
            </h1>

            <p>
              Administration
            </p>
          </div>

        </div>


        <div className="admin-area">

          <div className="admin-profile">

            <span className="admin-avatar">
              {session?.user?.email
                ?.charAt(0)
                .toUpperCase()}
            </span>

            <span className="admin-email">
              {session?.user?.email}
            </span>

          </div>


          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Déconnexion
          </button>

        </div>

      </header>


      {/* ===================================================
          CONTENU
          =================================================== */}

      <main className="dashboard-content">

        {/* Introduction */}

        <section className="dashboard-intro">

          <div>
            <div className="section-kicker">
              ✦ TABLEAU DE BORD
            </div>

            <h2>
              Gestion de l'événement
            </h2>

            <p>
              Suivez les invités et les arrivées
              en temps réel.
            </p>
          </div>


          <button
            onClick={loadData}
            className="refresh-button"
          >
            ↻ Actualiser
          </button>

        </section>


        {/* =================================================
            ERREUR
            ================================================= */}

        {error && (
          <div className="error-message">
            <strong>Erreur :</strong> {error}
          </div>
        )}


        {/* =================================================
            CHARGEMENT
            ================================================= */}

        {loading ? (

          <div className="loading-card">
            <div className="loading-symbol">
              ◆
            </div>

            <p>
              Chargement des invités...
            </p>
          </div>

        ) : (

          <>

            {/* =============================================
                STATISTIQUES
                ============================================= */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon">
                  👥
                </div>

                <div>
                  <p>
                    Total invités
                  </p>

                  <h3>
                    {totalGuests}
                  </h3>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <p>
                    Arrivés
                  </p>

                  <h3>
                    {arrivedCount}
                  </h3>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ◷
                </div>

                <div>
                  <p>
                    En attente
                  </p>

                  <h3>
                    {waitingCount}
                  </h3>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ✦
                </div>

                <div>
                  <p>
                    Taux d'arrivée
                  </p>

                  <h3>
                    {arrivalRate}%
                  </h3>
                </div>

              </div>

            </section>

            <nav className="admin-navigation">

  <button
    type="button"
    className={
      adminView === "guests"
        ? "active"
        : ""
    }
    onClick={() => setAdminView("guests")}
  >
    👥 Invités
  </button>

  <button
    type="button"
    className={
      adminView === "tables"
        ? "active"
        : ""
    }
    onClick={() => setAdminView("tables")}
  >
    🪑 Tables
  </button>

  <button
    type="button"
    className={
      adminView === "messages"
        ? "active"
        : ""
    }
    onClick={() => setAdminView("messages")}
  >
    💌 Messages

    {messages.length > 0 && (
      <span className="admin-navigation-count">
        {messages.length}
      </span>
    )}
  </button>

</nav>
{adminView === "messages" && (
  <section className="admin-messages-section">

  <div className="admin-messages-header">

    <div>
      <div className="admin-messages-title-row">
        <span className="admin-messages-icon">
          💌
        </span>

        <div>
          <h2>Messages</h2>

          <p>
            Les petits mots laissés par les invités
            pour Bruno.
          </p>
        </div>
      </div>
    </div>

    <div className="admin-messages-count">
      {messages.length} message
      {messages.length !== 1 ? "s" : ""}
    </div>

  </div>

  <div className="admin-messages-toolbar">

    <input
      type="text"
      value={messageSearch}
      onChange={(event) =>
        setMessageSearch(event.target.value)
      }
      placeholder="Rechercher un nom ou un message..."
      className="admin-message-search"
    />

    <button
      type="button"
      className="admin-message-refresh"
      onClick={loadMessages}
      disabled={messagesLoading}
    >
      {messagesLoading
        ? "Actualisation..."
        : "↻ Actualiser"}
    </button>

  </div>

  {messagesLoading ? (
    <div className="admin-messages-empty">
      Chargement des messages...
    </div>
  ) : filteredMessages.length === 0 ? (
    <div className="admin-messages-empty">
      <div>💌</div>

      <p>
        {messages.length === 0
          ? "Aucun message reçu pour le moment."
          : "Aucun message ne correspond à votre recherche."}
      </p>
    </div>
  ) : (
    <div className="admin-messages-list">

      {filteredMessages.map((item) => {

        const guest = item.guests || {};

        const guestName =
          guest.display_name ||
          [guest.first_name, guest.last_name]
            .filter(Boolean)
            .join(" ") ||
          "Invité inconnu";

        return (
          <article
            className="admin-message-card"
            key={item.id}
          >

            <div className="admin-message-avatar">
              💌
            </div>

            <div className="admin-message-body">

              <div className="admin-message-top">

                <div>
                  <strong>
                    {guestName}
                  </strong>

                  <span>
                    a laissé un message
                  </span>
                </div>

                <button
                  type="button"
                  className="admin-message-delete"
                  onClick={() =>
                    handleDeleteMessage(item)
                  }
                  disabled={
                    deletingMessage === item.id
                  }
                  title="Supprimer ce message"
                >
                  {deletingMessage === item.id
                    ? "..."
                    : "🗑️"}
                </button>

              </div>

              <p className="admin-message-text">
                {item.message}
              </p>

              <time>
                {new Date(
                  item.created_at
                ).toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>

            </div>

          </article>
        );
      })}

    </div>
  )}

</section>
)}



{/* =============================================
    GESTION DES TABLES
    ============================================= */}

{adminView === "tables" && (
  <section className="guests-section">
  <div className="guests-header">
  <div>
    <div className="section-kicker">
      ✦ TABLES
    </div>

    <h2>
      Gestion des tables
    </h2>

    <p>
      {tables.length} table(s) configurée(s)
    </p>
  </div>

  <button
    className="primary-button add-guest-button"
    onClick={() => setShowAddTable(true)}
  >
    <span>+</span>
    Ajouter une table
  </button>
</div>

  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Table</th>
          <th>Invités</th>
          <th>Arrivés</th>
          <th>En attente</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {tables.map((table) => {
          const stats = getTableStats(table.id);

          return (
            <tr key={table.id}>
              <td>
                <strong>
                  Table {table.table_number}
                </strong>
              </td>

              <td>
                {stats.total}
              </td>

              <td>
                {stats.arrived}
              </td>

              <td>
                {stats.total - stats.arrived}
              </td>

              <td>
  <button
  className="edit-button"
  onClick={() => setEditingTable(table)}
>
  Modifier
</button>

  <button
  className="arrival-button"
  onClick={() => setDeletingTable(table)}
>
  Supprimer
</button>
</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</section>
)}


            {/* =============================================
                LISTE DES INVITÉS
                ============================================= */}
          
            {adminView === "guests" && (
              <section className="guests-section">
                
                <div className="guests-header">

                <div>

                  <div className="section-kicker">
                    ✦ INVITÉS
                  </div>

                  <h2>
                    Liste des invités
                  </h2>

                  <p>
                    {filteredGuests.length} invité(s)
                  </p>

                </div>


                {/* RECHERCHE À DROITE */}

                <div className="search-container">

                  <span className="search-icon">
                    🔎
                  </span>

                  <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un invité..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />

                </div>

<button
  className="primary-button add-guest-button"
  onClick={() => setShowAddGuest(true)}
>
  <span>+</span>
  Ajouter
</button>

              </div>


              {/* =========================================
                  TABLE
                  ========================================= */}

              {filteredGuests.length === 0 ? (

                <div className="empty">
                  Aucun invité trouvé.
                </div>

              ) : (

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>
                        <th>Invité</th>
                        <th>Table</th>
                        <th>Arrivée</th>
                        <th>Heure</th>
                        <th>Action</th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredGuests.map((guest) => (

                        <tr key={guest.id}>

                          <td>
                            <div className="guest-name">
                              <span className="guest-dot"></span>
                              <strong>
                                {guest.display_name}
                              </strong>
                            </div>
                          </td>


                          <td>

                            <span className="table-badge">
                              Table{" "}
                              {getTableNumber(
                                guest.table_id
                              )}
                            </span>

                          </td>


                          <td>

                            {guest.has_arrived ? (

                              <span className="status arrived">
                                ✓ Arrivé
                              </span>

                            ) : (

                              <span className="status waiting">
                                En attente
                              </span>

                            )}

                          </td>


                          <td>

                            {guest.arrived_at
                              ? new Date(
                                  guest.arrived_at
                                ).toLocaleTimeString(
                                  "fr-FR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "—"}

                          </td>


                          <td>
  <button
    className="edit-button"
    onClick={() => setEditingGuest(guest)}
  >
    Modifier
  </button>

  <button
    className="arrival-button"
    onClick={() => toggleArrival(guest)}
  >
    Marquer arrivé
  </button>
</td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>
            )}
          </>


        )}

      </main>

      {showAddGuest && (
        <AddGuestModal
          tables={tables}
          onClose={() => setShowAddGuest(false)}
          onGuestAdded={handleGuestAdded}
        />
      )}

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          tables={tables}
          onClose={() => setEditingGuest(null)}
          onGuestUpdated={handleGuestUpdated}
        />
      )}

      {showAddTable && (
  <TableModal
    table={null}
    onClose={() => setShowAddTable(false)}
    onSave={async (_, number) => {
      return await handleAddTable(number);
    }}
  />
)}

{editingTable && (
  <TableModal
    table={editingTable}
    onClose={() => setEditingTable(null)}
    onSave={async (table, number) => {
      return await handleEditTable(
        table,
        number
      );
    }}
  />
)}

{deletingTable && (
  <DeleteTableModal
    table={deletingTable}
    onClose={() => setDeletingTable(null)}
    onConfirm={handleDeleteTable}
  />
)}

    </div>
  );
}


/* =========================================================
   APPLICATION
   ========================================================= */
function UnclePrivatePage() {
  const [view, setView] = useState("home");

  const [messages, setMessages] = useState([]);
  const [photos, setPhotos] = useState([]);

  const [eventConfig, setEventConfig] = useState(null);
  const [eventConfigLoading, setEventConfigLoading] = useState(false);

  const [messagesLoading, setMessagesLoading] =
    useState(false);

  const [photosLoading, setPhotosLoading] =
    useState(false);

  const [stats, setStats] = useState({
    guests: 0,
    arrived: 0,
    messages: 0,
    photos: 0,
    reactions: 0,
  });

  async function loadMessages() {
  setMessagesLoading(true);

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        guest_id,
        message,
        created_at,
        guests (
          id,
          display_name,
          first_name,
          last_name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Private messages loading error:",
        error
      );
      setMessages([]);
      return;
    }

    console.log(
      "PRIVATE MESSAGES:",
      data
    );

    setMessages(data || []);
  } catch (error) {
    console.error(
      "Unexpected private messages error:",
      error
    );

    setMessages([]);
  } finally {
    setMessagesLoading(false);
  }
}

  async function loadPhotos() {
  setPhotosLoading(true);

  try {
    const { data, error } = await supabase
      .from("gallery")
      .select(`
        id,
        photo_url,
        storage_path,
        created_at,
        guest_id,
        gallery_reactions (
          id,
          guest_id
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Private photos loading error:",
        error
      );

      setPhotos([]);
      return;
    }

    const formattedPhotos = (data || []).map(
      (photo) => ({
        ...photo,
        reactions:
          photo.gallery_reactions || [],
      })
    );

    setPhotos(formattedPhotos);
  } catch (error) {
    console.error(
      "Unexpected private photos error:",
      error
    );

    setPhotos([]);
  } finally {
    setPhotosLoading(false);
  }
}

  async function loadEventConfig() {
  setEventConfigLoading(true);

  try {
    const { data, error } = await supabase
      .from("event_settings")
      .select(`
        event_title,
        birthday_person_first_name,
        birthday_person_last_name,
        birthday_person_photo,
        birthday_person_message
      `)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Event config loading error:",
        error
      );
      setEventConfig(null);
      return;
    }

    console.log(
      "PRIVATE EVENT CONFIG:",
      data
    );

    setEventConfig(data);
  } catch (error) {
    console.error(
      "Unexpected event config error:",
      error
    );

    setEventConfig(null);
  } finally {
    setEventConfigLoading(false);
  }
}

  async function loadStats() {
    const [
      guestsResult,
      arrivedResult,
      messagesResult,
      photosResult,
      reactionsResult,
    ] = await Promise.all([
      supabase
        .from("guests")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("guests")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("has_arrived", true),

      supabase
        .from("messages")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("gallery")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("gallery_reactions")
        .select("id", {
          count: "exact",
          head: true,
        }),
    ]);

    setStats({
      guests: guestsResult.count || 0,
      arrived: arrivedResult.count || 0,
      messages: messagesResult.count || 0,
      photos: photosResult.count || 0,
      reactions: reactionsResult.count || 0,
    });
  }

  async function handleDownloadPhoto(photo) {
  if (!photo?.storage_path) {
    console.error(
      "Impossible de télécharger : storage_path manquant."
    );
    return;
  }

  try {
    const { data, error } = await supabase.storage
      .from("birthday-photos")
      .download(photo.storage_path);

    if (error) {
      console.error(
        "Photo download error:",
        error
      );

      alert(
        "Impossible d'enregistrer cette photo. Veuillez réessayer."
      );

      return;
    }

    const fileExtension =
      photo.storage_path
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const blobUrl =
      URL.createObjectURL(data);

    const link =
      document.createElement("a");

    link.href = blobUrl;

    link.download =
      `souvenir-anniversaire-${photo.id}.${fileExtension}`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(
      "Unexpected photo download error:",
      error
    );

    alert(
      "Une erreur est survenue pendant l'enregistrement."
    );
  }
}

async function handleDownloadAllPhotos() {
  if (!photos.length) {
    return;
  }

  for (const photo of photos) {
    await handleDownloadPhoto(photo);

    // Petite pause pour éviter de lancer
    // tous les téléchargements exactement en même temps.
    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );
  }
}

  async function loadPrivatePage() {
  await Promise.all([
    loadMessages(),
    loadPhotos(),
    loadStats(),
    loadEventConfig(),
  ]);
}

  useEffect(() => {
    loadPrivatePage();
  }, []);

  return (
    <div className="uncle-private-page">
      <header className="uncle-private-header">
        <div>
          <div className="uncle-private-decoration">
            ✦ ◆ ✦
          </div>

          <p className="uncle-private-eyebrow">
            ANNIVERSAIRE SURPRISE
          </p>

          <h1>
            Pour Bruno George Touko ❤️
          </h1>

          <p>
            Tous les souvenirs et messages laissés
            par tes proches.
          </p>
        </div>

        <button
          type="button"
          className="uncle-refresh-button"
          onClick={loadPrivatePage}
        >
          ↻ Actualiser
        </button>
      </header>

      <main className="uncle-private-content">
        <section className="uncle-stats-grid">
          <div className="uncle-stat-card">
            <span>💌</span>
            <strong>{stats.messages}</strong>
            <small>Messages</small>
          </div>

          <div className="uncle-stat-card">
            <span>📸</span>
            <strong>{stats.photos}</strong>
            <small>Photos</small>
          </div>

          <div className="uncle-stat-card">
            <span>❤️</span>
            <strong>{stats.reactions}</strong>
            <small>Réactions</small>
          </div>

          <div className="uncle-stat-card">
            <span>👥</span>
            <strong>
              {stats.arrived}/{stats.guests}
            </strong>
            <small>Invités arrivés</small>
          </div>
        </section>

        <nav className="uncle-private-nav">
          <button
            type="button"
            className={
              view === "home" ? "active" : ""
            }
            onClick={() => setView("home")}
          >
            🏠 Accueil
          </button>

          <button
            type="button"
            className={
              view === "messages" ? "active" : ""
            }
            onClick={() => setView("messages")}
          >
            💌 Messages
          </button>

          <button
            type="button"
            className={
              view === "photos" ? "active" : ""
            }
            onClick={() => setView("photos")}
          >
            📸 Photos
          </button>
        </nav>

        {view === "home" && (
          <section className="uncle-welcome-card">
            <div className="uncle-welcome-icon">
              🎂
            </div>

            <h2>
              Joyeux anniversaire Bruno !
            </h2>

            <p>
              Cette page rassemble les petits mots,
              les photos et les réactions de toutes
              les personnes venues célébrer ce moment
              avec toi.
            </p>

            <div className="uncle-welcome-decoration">
              ◆ ✦ ◆ ✦ ◆
            </div>

            {eventConfig?.birthday_person_message && (
  <section className="uncle-personal-message">
    <div className="uncle-personal-message-decoration">
      ✦ ◆ ✦
    </div>

    <div className="uncle-personal-message-icon">
      💌
    </div>

    <p className="uncle-personal-message-label">
      UN MESSAGE SPÉCIAL POUR TOI
    </p>

    <h2>
      De la part de Carlane ❤️
    </h2>

    <div className="uncle-personal-message-text">
      {eventConfig.birthday_person_message}
    </div>

    <div className="uncle-personal-message-decoration bottom">
      ◆ ✦ ◆
    </div>
  </section>
)}
          </section>
        )}



        

        {view === "messages" && (
          <section className="uncle-section">
            <div className="uncle-section-header">
              <div>
                <h2>💌 Les messages</h2>
                <p>
                  Les mots laissés spécialement pour toi.
                </p>
              </div>

              <span>
                {messages.length} message
                {messages.length !== 1 ? "s" : ""}
              </span>
            </div>

            {messagesLoading ? (
              <div className="uncle-empty-state">
                Chargement des messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="uncle-empty-state">
                <div>💌</div>
                <p>
                  Aucun message pour le moment.
                </p>
              </div>
            ) : (
              <div className="uncle-messages-list">
                {messages.map((item) => {
  const guest = item.guests || {};

  const guestName =
    guest.display_name ||
    [guest.first_name, guest.last_name]
      .filter(Boolean)
      .join(" ") ||
    "Un invité";

  return (
    <article
      className="uncle-message-card"
      key={item.id}
    >
      <div className="uncle-message-icon">
        💌
      </div>

      <div className="uncle-message-content">
        <div className="uncle-message-author">
          <strong>{guestName}</strong>
          <span>vous a laissé un message</span>
        </div>

        <p>{item.message}</p>

        <small>
          {new Date(
            item.created_at
          ).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </small>
      </div>
    </article>
  );
})}
              </div>
            )}
          </section>
        )}

        {view === "photos" && (
          <section className="uncle-section">
            <div className="uncle-section-header">
  <div>
    <h2>📸 Les souvenirs</h2>

    <p>
      Toutes les photos partagées par les invités.
    </p>
  </div>

  {photos.length > 0 && (
    <button
      type="button"
      className="uncle-download-all-button"
      onClick={handleDownloadAllPhotos}
    >
      ↓ Enregistrer toutes les photos
    </button>
  )}
</div>

            {photosLoading ? (
              <div className="uncle-empty-state">
                Chargement des photos...
              </div>
            ) : photos.length === 0 ? (
              <div className="uncle-empty-state">
                <div>📸</div>
                <p>
                  Aucune photo pour le moment.
                </p>
              </div>
            ) : (
              <div className="uncle-private-gallery">
                {photos.map((photo) => (
                  <div
  className="uncle-private-photo"
  key={photo.id}
>
  <img
    src={photo.photo_url}
    alt="Souvenir de l'anniversaire"
    loading="lazy"
  />

  <div className="uncle-photo-reactions">
    ❤️{" "}
    {(photo.reactions || []).length}
  </div>

  <button
    type="button"
    className="uncle-download-photo-button"
    onClick={() =>
      handleDownloadPhoto(photo)
    }
    title="Enregistrer cette photo"
  >
    ↓
  </button>
</div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function App() {
  
  const urlParams = new URLSearchParams(
    window.location.search
  );

  const isAdmin =
    urlParams.get("admin") === "1";

  const isUncle =
    urlParams.get("uncle") === "1";

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(isAdmin);

  useEffect(() => {
    // La page invité n'a pas besoin de connexion
    if (!isAdmin) {
      return;
    }

    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isAdmin]);

  // 🟢 PAGE INVITÉ
  if (!isAdmin && !isUncle) {
    return <GuestPage />;
  }

  // ❤️ PAGE PERSONNELLE DE BRUNO
  // Elle s'ouvre directement avec ?uncle=1
  if (isUncle) {
    return <UnclePrivatePage />;
  }

  // 🔐 PAGE ADMINISTRATEUR
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          Chargement...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard session={session} />;
}

export default App;