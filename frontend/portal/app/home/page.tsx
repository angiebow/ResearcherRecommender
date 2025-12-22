"use client";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-slate-200">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-4 leading-tight">
        RESEARCHER RECOMMENDATION SYSTEM
      </h1>

      <h2 className="text-lg text-center text-slate-400 mb-12">
        Based on Publication Records Utilizing Transformer-Based Models 
        and Similarity–Distance Metrics
      </h2>

      {/* Thesis identity */}
      <section className="bg-slate-800 rounded-lg p-6 mb-14 border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Thesis Information</h3>

        <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
          <p>
            <strong>Student Name / NRP:</strong> Pelangi Masita Wati / 5025221051
          </p>
          <p>
            <strong>Department:</strong> Informatics Engineering – FTEIC ITS
          </p>
          <p>
            <strong>Advisor:</strong> Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D
          </p>
          <p>
            <strong>Co-Advisor:</strong> Dini Adni Navastara, S.Kom., M.Sc.
          </p>
        </div>
      </section>

      {/* Abstract */}
      <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Abstract</h3>

        <p className="text-slate-300 leading-relaxed text-justify">
          Recommendation systems are one application of machine learning that
          utilizes data to predict or suggest objects, content, or services that
          are relevant to users. In an academic context, similar systems have
          been used to find relevant researchers. However, many existing 
          solutions are still limited to keyword-based or simple statistical
          approaches, which are less capable of capturing the semantic meaning
          and context of a research topic.
        </p>

        <p className="text-slate-300 leading-relaxed text-justify mt-4">
          Therefore, this study aims to develop a researcher recommendation
          system based on publication records using a transformer-based language
          model and similarity–distance metrics. This system is designed to 
          provide recommendations for researcher names that are relevant to the
          user’s input topic. Experiments were conducted by evaluating several
          parameter configurations, including data usage scenarios, transformer
          models that had been fine-tuned, and similarity metrics to identify
          the most optimal settings.
        </p>

        <p className="text-slate-300 leading-relaxed text-justify mt-4">
          To evaluate performance, this study uses Top-K retrieval evaluation
          supported by NDCG (Normalized Discounted Cumulative Gain), MAP (Mean
          Average Precision), and dimensionality reduction visualization using
          LDA and UMAP to illustrate topic distribution. The dataset used 
          consists of publication text obtained from the institution’s research
          information database.
        </p>

        <p className="text-slate-300 leading-relaxed text-justify mt-4">
          Experimental results show that the optimal combinations were achieved
          through the MPNet and DistilBERT models accompanied by Minkowski and
          KL distance metrics, demonstrating strong semantic recommendation
          capability for researcher identification tasks.
        </p>
      </section>
    </main>
  );
}
