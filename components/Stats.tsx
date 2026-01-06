"use client";

const Stats = () => {
    const stats = [
        { label: "Course Participant", value: "500+" },
        { label: "International Achievement", value: "20+" },
        { label: "Sponsorship", value: "10+" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {stats.map((stat, index) => (
                    <div key={index} className="space-y-2 group transition-transform hover:scale-105">
                        <h2 className="text-5xl font-bold text-primary">{stat.value}</h2>
                        <p className="text-xl text-primary/80 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
