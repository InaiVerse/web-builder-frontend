import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import updatesData from "./updatesData";
import LeftSidebar from "./leftSidebar";
import Header from "./Header";
import "../../../App.css";

function UpdateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const update = useMemo(
    () => updatesData.find((entry) => entry.id === id) ?? updatesData[0],
    [id]
  );

  return (
    <div className="app-background min-h-screen">
      <div className="content-wrapper relative flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
          <LeftSidebar onClose={() => null} />
        </aside>

        <div className="flex flex-1 flex-col overflow-x-hidden lg:ml-64 lg:h-screen">
          <div className="sticky top-0 z-20 bg-[#101010]/95 backdrop-blur">
            <Header
              title="Update Details"
              className="border-transparent bg-transparent"
              showSidebarToggle={false}
              onToggleSidebar={() => null}
              onCreateProject={() => navigate("/admin")}
              onCreditClick={() => navigate("/pricing")}
              onToggleProfile={() => null}
              isProfileOpen={false}
              userName="Trusha INAI"
            />
          </div>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-12">
              <section className="space-y-8">
                <div className="overflow-hidden">
                  <img
                    src={update.image}
                    alt={update.title}
                    className="h-[360px] w-full object-cover"
                  />
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-white/70">
                  {update.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-4 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <header className="space-y-4">
                  <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                    {update.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                    <span>{update.category}</span>
                    <span>•</span>
                    <span>By {update.author}</span>
                  </div>
                </header>

                <article className="space-y-6 text-base leading-relaxed text-white/70">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime omnis
                    voluptatibus deleniti, repellendus rerum distinctio dolore cumque esse
                    consequuntur obcaecati molestias corrupti sequi nihil quos ducimus neque quasi
                    inventore laboriosam.
                  </p>
                  <p>
                    Curabitur sed semper risus. Integer facilisis leo id eros laoreet, sed dapibus
                    ligula euismod. Vestibulum mollis lorem justo, quis euismod mauris mollis vel.
                    Suspendisse potenti. Phasellus malesuada placerat magna, eu varius quam mattis
                    non.
                  </p>
                  <p>
                    Morbi placerat, leo sit amet cursus dictum, arcu orci lobortis urna, vitae
                    feugiat leo magna et orci. Nulla facilisi. Nulla facilisi. Nam quis tincidunt
                    metus. Donec ac metus augue. Integer mi urna, vestibulum ac ex et, porttitor
                    faucibus sem.
                  </p>
                </article>
              </section>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="self-end cursor-pointer rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/30"
              >
                ← Back to updates
              </button>


            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UpdateDetail;
