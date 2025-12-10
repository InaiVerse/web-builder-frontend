import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import LeftSidebar from "./leftSidebar";
import "../../../App.css";

const helpSections = [
  {
    title: "What is Lorem Ipsum?",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam posuere lacus erat, eget facilisis egestas, et placerat est volutpat. Sed dictum ante sit amet congue hendrerit. Nunc eleifend eu risus sed condimentum. Aenean leo turpis, malesuada ac elit et, varius posuere nibh. Aliquam sed lectus sapien, at cursus orci. Morbi eu ex diam. Cras ipsum neque, maximus at purus in, varius posuere ipsum. Nullam eget sem vitae felis vehicula vulputate. Donec sollicitudin interdum ac mi. Donec et nulla imperdiet sollicitudin quis in leo. Aenean at diam quis nisl dictum cursus. Ut mollis odio aliquam lorem sodales, et fringilla nisl ultricies. Donec a justo tincidunt, pharetra nisl sed, vulputate sapien.",
      "Fusce eleifend fringilla libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam ornare, ante sit amet consequat laoreet, erat massa hendrerit nisi, tincidunt rutrum eros elit quis odio. Nunc lacinia augue, congue eu nunc at, vulputate tristique ligula. Praesent vestibulum auctor odio, ut finibus turpis semper vitae. Duis pellentesque orci ac fringilla bibendum. Donec sit amet nisl dapibus, aliquet purus vel, luctus eros. Cras enim elit, interdum id porttitor et, egestas et orci. Morbi at libero mi. Sed gravida egestas metus. Fusce ornare justo at eros cursus, id vulputate in tortor in, tempor ullamcorper orci. Proin consequat quam ac posuere congue. Nullam tincidunt fringilla orci vitae pellentesque. Proin consectetur nec purus vestibulum, ac tincidunt turpis rutrum. Curabitur ac dui eros. Donec posuere sed justo maximus tristique.",
    ],
  },
  {
    title: "Where does it come from?",
    paragraphs: [
      "Nullam egestas tortor nec laoreet viverra, ac blandit sapien consequat. Ut congue porta lacus, ut fringilla dolor imperdiet sit amet. Vivamus in tellus tortor. Phasellus vestibulum, libero aliquet aliquam tristique, ipsum est egestas turpis, vitae rhoncus justo eros a eros. Donec sit amet nisi dapibus, aliquet purus vel, luctus eros. Cras enim elit, interdum id porttitor et, egestas et orci. Morbi at libero mi. Sed gravida egestas metus. Fusce ornare justo at eros cursus, id vulputate ante tortor in, tempor ullamcorper orci. Proin consequat quam ac posuere congue. Nullam tincidunt fringilla orci vitae pellentesque. Proin consectetur nec purus vestibulum, ac tincidunt turpis rutrum. Curabitur ac dui eros. Donec posuere sed justo maximus tristique.",
      "Ut non nibh lorem. Sed lobortis vulputate eros in tempus. Nullam lobortis felis eget consectetur pharetra. Sed at sapien ultricies, luctus tellus sed, tempus dolor. Suspendisse augue arcu, ullamcorper at volutpat id, consequat eget orci. Duis eu metus a quam eleifend fringilla quis sed nunc. Ut at lacus vel ex convallis tempor at quis magna.",
    ],
  },
  {
    title: "Where can I get some?",
    paragraphs: [
      "In non erat in nulla condimentum molestie. Aenean vel ex non nisl vestibulum congue sed blandit malesuada tortor, sed molestie sem. Ut sit amet lectus sit amet ligula posuere venenatis. Nullam lorem augue, consequat a leo vel, laoreet consequat orci. Donec eget suscipit augue at nulla dapibus ullamcorper. In magna lectus, tincidunt non scelerisque et, pharetra in arcu. Nunc varius sem nec tellus iaculis. Quisque diam nisl, egestas non urna eget, imperdiet rhoncus. Nam pulvinar bibendum turpis, ut rhoncus turpis bibendum in. Ut lacinia nibh ultrices quam elementum, vel congue tortor auctor. Etiam laoreet dui eu urna efficitur imperdiet at sed purus, in porttitor dolor sodales. Quisque vitae mauris malesuada, faucibus mi sed, consequat tortor.",
      "Praesent id enim ac sem mollis, et porttitor dolor sodales. Quisque vitae mauris malesuada, faucibus mi sed, consequat tortor."
    ],
  },
];

const supportHighlights = [
  { label: "Subscription", description: "Manage billing preferences and plan changes." },
  { label: "Help Center", description: "Browse tutorials, FAQs, and best practices." },
  { label: "Latest Updates", description: "Stay in sync with release notes and feature drops." },
];

function Help() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userName = "Trusha INAI";

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
              title="Help"
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

          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
              <section className="relative overflow-hidden ">
                <div className="absolute -left-32 top-10 h-64 w-64 rounded-full" />
                <div className="absolute -right-20 bottom-12 h-56 w-56" />

                <div className="relative z-10 flex flex-col gap-12 p-8 sm:p-12">

                  <div className="space-y-12">
                    {helpSections.map((section) => (
                      <article key={section.title} className="space-y-4">
                        <h2 className="text-[26px] font-semibold text-white sm:text-3xl">{section.title}</h2>
                        <div className="space-y-4 text-sm leading-relaxed text-white/80 sm:text-base">
                          {section.paragraphs.map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex} className="text-[14px]">{paragraph}</p>
                          ))}
                        </div>
                      </article>
                    ))}
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

export default Help;
