import React from 'react';
import './styles/DairyNewsReports.css';

const DairyNewsReports = () => {

  const newsAndReports = {

    kenyanSources: [
      {
        title: "Kenya Dairy Board",
        description: "Official dairy industry regulator in Kenya",
        url: "https://www.kdb.go.ke/",
        type: "reports"
      },
      {
        title: "Dairy News Kenya",
        description: "Latest dairy farming news and updates from Kenya",
        url: "https://dairyafrica.com/kenya",
        type: "news"
      },
      {
        title: "Kenya Agricultural Research Institute",
        description: "Research reports on dairy farming in Kenya",
        url: "https://www.kalro.org/",
        type: "reports"
      },
      {
        title: "Farmers Trend Kenya",
        description: "Trending dairy farming news and practices",
        url: "https://farmerstrend.co.ke/category/livestock-farming/dairy-farming/",
        type: "news"
      },
      {
        title: "Ministry of Agriculture - Livestock Department",
        description: "Government reports on dairy sector",
        url: "https://kilimo.go.ke/",
        type: "reports"
      }
    ],
    internationalSources: [
      {
        title: "Progressive Dairy",
        description: "Global dairy farming news and insights",
        url: "https://www.progressivedairy.com/",
        type: "news"
      },
      {
        title: "Dairy Global",
        description: "International dairy industry news and market reports",
        url: "https://www.dairyglobal.net/",
        type: "news"
      },
      {
        title: "IFCN Dairy Research Network",
        description: "International dairy research and reports",
        url: "https://ifcndairy.org/",
        type: "reports"
      },
      {
        title: "The Cattle Site",
        description: "Global cattle and dairy farming news",
        url: "https://www.thecattlesite.com/",
        type: "news"
      },
      {
        title: "FAO Dairy Portal",
        description: "UN Food and Agriculture Organization dairy reports",
        url: "http://www.fao.org/dairy-production-products/en/",
        type: "reports"
      },
      {
        title: "Dairy Reporter",
        description: "International dairy industry news and analysis",
        url: "https://www.dairyreporter.com/",
        type: "news"
      },
      {
        title: "USDA Dairy Reports",
        description: "US Department of Agriculture dairy market reports",
        url: "https://www.ams.usda.gov/market-news/dairy",
        type: "reports"
      },
      {
        title: "DairyNZ",
        description: "New Zealand dairy research and reports",
        url: "https://www.dairynz.co.nz/",
        type: "reports"
      },
      {
        title: "The Dairy Site",
        description: "Global dairy news and market updates",
        url: "https://www.thedairysite.com/",
        type: "news"
      },
      {
        title: "European Dairy Association",
        description: "European dairy sector reports and statistics",
        url: "http://eda.euromilk.org/",
        type: "reports"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-blue-500 text-white-800 p-4 rounded-lg text-center">Dairy News and Reports</h1>
      
      {/* Kenyan Sources */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Kenyan Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsAndReports.kenyanSources.map((item, index) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="block"
            >
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-2">{item.description}</p>
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {item.type === 'news' ? 'News' : 'Reports'}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* International Sources */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">International Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsAndReports.internationalSources.map((item, index) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="block"
            >
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-2">{item.description}</p>
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {item.type === 'news' ? 'News' : 'Reports'}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DairyNewsReports; 