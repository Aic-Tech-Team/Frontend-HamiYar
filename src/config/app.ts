interface AppConfig {
  app: {
    name: string;
  };
  university: {
    name: string;
    city: string;
  };
  contact: {
    phone: string;
    email: string;
    address?: string;
  };
  aic: {
    website: string;
    name: string;
    nickname: string;
    techTeam: string;
    contact: {
      telegram: {
        username: string;
        url: string;
      };
      email: {
        address: string;
        mailto: string;
      };
      address: {
        text: string;
        url: string;
      };
    };
    social: {
      telegram: {
        username: string;
        url: string;
      };
      linkedin: {
        username: string;
        url: string;
      };
      instagram: {
        username: string;
        url: string;
      };
    };
  };
}

export const appConfig: AppConfig = {
  app: {
    name: "سامانه حامی یار",
  },
  university: {
    name: "دانشگاه آزاد اسلامی",
    city: "",
  },
  contact: {
    phone: "026-3418-1234",
    email: "info@kaic.karaj.iau.ir",
  },
  aic: {
    website: "https://kaic.karaj.iau.ir/",
    name: "انجمن علمی هوش مصنوعی",
    nickname: "AIC",
    techTeam: "AIC Tech",
    contact: {
      telegram: {
        username: "@Aickiau",
        url: "https://t.me/Aickiau",
      },
      email: {
        address: "aickiau@gmail.com",
        mailto: "mailto:aickiau@gmail.com",
      },
      address: {
        text: "دانشگاه آزاد اسلامی واحد کرج، ساختمان مرکز رشد و فناوری",
        url: "#",
      },
    },
    social: {
      telegram: {
        username: "@Aickiau",
        url: "https://t.me/aic_kiau",
      },
      linkedin: {
        username: "AIC",
        url: "https://www.linkedin.com/company/aickiau",
      },
      instagram: {
        username: "aickiau",
        url: "https://www.instagram.com/aickiau",
      },
    },
  },
};
