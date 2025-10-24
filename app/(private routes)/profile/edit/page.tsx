"use client";

import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import css from "./page.module.css";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateMe, UpdateMeRequest } from "@/lib/api/clientApi";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Loader from "@/components/Loader/Loader";

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState(user?.username || "");
  const [error, setError] = useState<string | null>(null);

  const updateProfileMutation = useMutation<
    Awaited<ReturnType<typeof updateMe>>,
    AxiosError<{ message?: string }>,
    UpdateMeRequest
  >({
    mutationFn: async (body) => updateMe(body),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("✅ Profile updated successfully!");
      router.push("/profile");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(`❌ ${message}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("❌ User email not found");
      return;
    }

    const body: UpdateMeRequest = {
      email: user.email,
      username,
    };

    updateProfileMutation.mutate(body);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
    if (value.trim().length < 1) {
      setError("Name must be at least 1 characters long");
    } else {
      setError(null);
    }
  };

  const onClose = () => {
    router.back();
  };

  return (
    <>
      {updateProfileMutation.isPending && <Loader />}
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>

          <Image
            src={
              user?.avatar ||
              "https://ac.goit.global/fullstack/react/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />

          <form onSubmit={handleSubmit} className={css.profileInfo}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username:</label>
              <input
                defaultValue={user?.username}
                id="username"
                type="text"
                name="username"
                className={css.input}
                onChange={handleChange}
              />
              {error && <span className={css.error}>{error}</span>}
            </div>

            <p>Email: {user?.email}</p>

            <div className={css.actions}>
              <button
                type="submit"
                className={css.saveButton}
                disabled={updateProfileMutation.isPending}>
                Save
              </button>
              <button
                onClick={onClose}
                type="button"
                className={css.cancelButton}
                disabled={updateProfileMutation.isPending}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
