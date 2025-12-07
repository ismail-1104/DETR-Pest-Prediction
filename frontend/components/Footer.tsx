import Link from "next/link";
import { Mail, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">DETR</h3>
            <p className="text-gray-400 mb-4">
              Predict. Protect. Prosper. Harvesting Security, Nurturing Growth: Where Predictive Analysis Meets Agricultural Resilience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Team</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Terms</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-500 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DETR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
