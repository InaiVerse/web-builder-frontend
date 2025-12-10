import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import Header from "./Header";
import LeftSidebar from "./leftSidebar";
import updatesData from "./updatesData";
import "../../../App.css";

function Updates() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userName = "Trusha INAI";

  const { highlight, featurePrimary, featureSecondary, spotlight } = useMemo(() => {
    const [first, second, third, fourth] = updatesData;
    return {
      highlight: first,
      featurePrimary: second,
      featureSecondary: third,
      spotlight: fourth,
    };
  }, []);

  const handleNavigateToDetail = (id) => {
    navigate(`/updates/${id}`);
  };

  const handleToggleProfile = (event) => {
    event.stopPropagation();
    setIsProfileOpen((prev) => !prev);
  };

  const handleToggleSidebar = (event) => {
    event.stopPropagation();
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleCloseOverlays = () => {
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
  };

  const renderTag = (tag) => (
    <span
      key={tag}
      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
    >
      {tag}
    </span>
  );

  const ReadButton = ({ variant = "light", onClick } = {}) => (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center w-[150px] gap-2 rounded-full border px-5 py-2 text-xs font-semibold transition ${
        variant === "dark"
          ? "border-white/70 bg-white text-black hover:border-white/90 hover:bg-white"
          : "border-white/20 bg-white text-black hover:border-white/40 hover:bg-white/95"
      }`}
      onClick={onClick}
    >
      Read Article
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          variant === "dark" ? "border-black/10 bg-black/5" : "border-black/10 bg-black/5"
        }`}
      >
        <IoIosArrowRoundForward
          className="h-4 w-4 text-black"
        />
      </span>
    </button>
  );

  const renderHighlightCard = (update) => (
    <article
      className="flex min-h-[300px] w-[700px] flex-col overflow-hidden transition hover:scale-[1.01] sm:flex-row"
    >
      <div className="relative h-[200px] w-full sm:h-auto sm:w-1/2">
        <img src={update.image} alt={update.title} className="h-full w-full object-cover" />
        {update.live ? (
          <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold text-black shadow">
            Live Updates
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white sm:text-[28px]">{update.title}</h2>
          <p className="text-sm text-white/70 sm:text-base">{update.excerpt}</p>
          <p className="text-sm text-white/60 sm:text-base">{update.description}</p>
        </div>
        <ReadButton
          variant="dark"
          onClick={() => handleNavigateToDetail(update.id)}
        />
      </div>
    </article>
  );

  const renderTextCard = (update, { subtle = false } = {}) => (
    <article
      className={`flex h-full w-[350px] flex-col justify-between px-8 transition hover:scale-[1.01]`}
    >
      <div className="space-y-5">
        <div className="overflow-hidden">
          <img src={update.image} alt={update.title} className="h-40 w-full object-cover" />
        </div>
        {update.tags?.length ? (
          <div className="flex flex-wrap gap-2 text-xs font-medium text-white/80">
            {update.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{update.title}</h3>
          <p className="text-sm text-white/70 sm:text-base">{update.excerpt}</p>
          <p className="text-sm text-white/60">{update.description}</p>
        </div>
      </div>
      <div className="mt-3">
        <ReadButton onClick={() => handleNavigateToDetail(update.id)} />
      </div>
    </article>
  );

  const renderStackedCard = (update) => (
    <article
      className="mt-3 flex min-h-[300px] w-full flex-col justify-between transition hover:scale-[1.01]"
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">{update.title}</h3>
        <p className="text-sm text-white/70 sm:text-base">{update.excerpt}</p>
        <p className="text-sm text-white/60">{update.description}</p>
      </div>
      <div className="mt-6">
        <ReadButton onClick={() => handleNavigateToDetail(update.id)} />
      </div>
    </article>
  );

  return (
    <div className="app-background min-h-screen" onClick={handleCloseOverlays}>
      <div className="content-wrapper relative flex min-h-screen w-full flex-col lg:flex-row">
        <div
          className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
            isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={(event) => {
            event.stopPropagation();
            handleCloseSidebar();
          }}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] transform transition-transform duration-300 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <LeftSidebar className="h-full" onClose={handleCloseSidebar} />
        </aside>

        <div
          className="flex flex-1 flex-col overflow-x-hidden lg:ml-64 lg:h-screen"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="sticky top-0 z-30 bg-[#101010]/95 backdrop-blur">
            <Header
              title="Latest Updates"
              className="border-transparent bg-transparent"
              onToggleSidebar={handleToggleSidebar}
              showSidebarToggle
              onCreateProject={() => navigate("/admin")}
              onToggleProfile={handleToggleProfile}
              isProfileOpen={isProfileOpen}
              userName={userName}
              onCreditClick={() => navigate("/pricing")}
            />
          </div>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl">
              <section className="pt-12 pb-12">
                <div className="grid lg:grid-cols-[minmax(0,780px)_minmax(0,1fr)]">
                  <div className="flex w-full max-w-[780px] flex-col gap-8">
                    {highlight ? renderHighlightCard(highlight) : null}
                    <div className="grid gap-6 sm:grid-cols-2">
                      {featureSecondary ? renderStackedCard(featureSecondary) : null}
                      {spotlight ? renderStackedCard(spotlight) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    {featurePrimary ? renderTextCard(featurePrimary) : null}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Updates;


