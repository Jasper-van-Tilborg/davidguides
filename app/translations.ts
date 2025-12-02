// Define supported languages
export type Language = "nl" | "en";

// Type definition for all translations
export type Translations = {
  [key in Language]: {
    common: {
      appName: string;
      loading: string;
      save: string;
      cancel: string;
      delete: string;
      edit: string;
      add: string;
      close: string;
      installApp: string;
      install: string;
      installed: string;
    };
    auth: {
      signIn: string;
      signUp: string;
      signOut: string;
      email: string;
      password: string;
      forgotPassword: string;
      noAccount: string;
      hasAccount: string;
      magicLink: string;
    };
    habits: {
      title: string;
      addHabit: string;
      noHabits: string;
      completed: string;
      notCompleted: string;
      completeHabit: string;
      habitName: string;
      habitDescription: string;
      xpReward: string;
      streak: string;
      days: string;
    };
    adventure: {
      title: string;
      level: string;
      xp: string;
      progress: string;
      nextLevel: string;
      worldMap: string;
      currentWorld: string;
    };
    admin: {
      title: string;
      templates: string;
      achievements: string;
      translations: string;
    };
    calendar: {
      title: string;
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
      sun: string;
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
      today: string;
      goToToday: string;
      allCompleted: string;
      someCompleted: string;
      noHabits: string;
      habitsForDate: string;
    };
    install: {
      iosInstructions: string;
    };
  };
};

// All translations - Dutch and English
export const translations: Translations = {
  nl: {
    common: {
      appName: "Gewoonte Avontuur",
      loading: "Laden...",
      save: "Opslaan",
      cancel: "Annuleren",
      delete: "Verwijderen",
      edit: "Bewerken",
      add: "Toevoegen",
      close: "Sluiten",
      installApp: "Installeer App",
      install: "Installeer",
      installed: "Geïnstalleerd",
    },
    auth: {
      signIn: "Inloggen",
      signUp: "Registreren",
      signOut: "Uitloggen",
      email: "E-mail",
      password: "Wachtwoord",
      forgotPassword: "Wachtwoord vergeten?",
      noAccount: "Nog geen account?",
      hasAccount: "Al een account?",
      magicLink: "Verstuur Magic Link",
    },
    habits: {
      title: "Mijn Gewoontes",
      addHabit: "Gewoonte Toevoegen",
      noHabits: "Nog geen gewoontes. Begin je avontuur!",
      completed: "Voltooid",
      notCompleted: "Niet Voltooid",
      completeHabit: "Gewoonte Voltooien",
      habitName: "Gewoonte Naam",
      habitDescription: "Beschrijving",
      xpReward: "XP Beloning",
      streak: "Reeks",
      days: "dagen",
    },
    adventure: {
      title: "Avontuur",
      level: "Niveau",
      xp: "XP",
      progress: "Voortgang",
      nextLevel: "Volgende Niveau",
      worldMap: "Wereldkaart",
      currentWorld: "Huidige Wereld",
    },
    admin: {
      title: "Admin Dashboard",
      templates: "Gewoonte Sjablonen",
      achievements: "Prestaties",
      translations: "Vertalingen",
    },
    calendar: {
      title: "Kalender",
      january: "Januari",
      february: "Februari",
      march: "Maart",
      april: "April",
      may: "Mei",
      june: "Juni",
      july: "Juli",
      august: "Augustus",
      september: "September",
      october: "Oktober",
      november: "November",
      december: "December",
      sun: "Zo",
      mon: "Ma",
      tue: "Di",
      wed: "Wo",
      thu: "Do",
      fri: "Vr",
      sat: "Za",
      today: "Vandaag",
      goToToday: "Vandaag",
      allCompleted: "Alle gewoontes voltooid",
      someCompleted: "Sommige gewoontes voltooid",
      noHabits: "Nog geen gewoontes. Voeg gewoontes toe om te volgen!",
      habitsForDate: "Gewoontes voor deze dag",
    },
    install: {
      iosInstructions:
        "Om de app te installeren:\n\n1. Klik op de Share knop (vierkant met pijl)\n2. Scroll naar beneden\n3. Klik \"Add to Home Screen\"\n4. Klik \"Add\"",
    },
  },
  en: {
    common: {
      appName: "Habit Adventure",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      close: "Close",
      installApp: "Install App",
      install: "Install",
      installed: "Installed",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      magicLink: "Send Magic Link",
    },
    habits: {
      title: "My Habits",
      addHabit: "Add Habit",
      noHabits: "No habits yet. Start your adventure!",
      completed: "Completed",
      notCompleted: "Not Completed",
      completeHabit: "Complete Habit",
      habitName: "Habit Name",
      habitDescription: "Description",
      xpReward: "XP Reward",
      streak: "Streak",
      days: "days",
    },
    adventure: {
      title: "Adventure",
      level: "Level",
      xp: "XP",
      progress: "Progress",
      nextLevel: "Next Level",
      worldMap: "World Map",
      currentWorld: "Current World",
    },
    admin: {
      title: "Admin Dashboard",
      templates: "Habit Templates",
      achievements: "Achievements",
      translations: "Translations",
    },
    calendar: {
      title: "Calendar",
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      today: "Today",
      goToToday: "Today",
      allCompleted: "All habits completed",
      someCompleted: "Some habits completed",
      noHabits: "No habits yet. Add some habits to track!",
      habitsForDate: "Habits for this day",
    },
    install: {
      iosInstructions:
        "To install the app:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down\n3. Tap \"Add to Home Screen\"\n4. Tap \"Add\"",
    },
  },
};

// Helper function to get translations for a language
export function getTranslations(lang: Language) {
  return translations[lang] || translations.nl;
}

// Validate and return a safe language code
export function validateLanguage(lang: string): Language {
  if (lang === "nl" || lang === "en") {
    return lang;
  }
  return "nl"; // Default to Dutch
}

