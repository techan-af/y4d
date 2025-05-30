import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Target, Award, ArrowRight, Phone, Mail, MapPin, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="https://www.y4d.ngo/" className="flex items-center justify-center">
          <Image
            src="https://drive.google.com/thumbnail?id=1_onbIw3cskpFbqICN8k9FfgWZ_2iUote&sz=w8000"
            alt="Y4D NGO Logo"
            width={40}
            height={10}
            className="h-auto w-28 rounded-full object-cover pl-4"
            priority
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Button>
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-green-600 transition-colors">
            About
          </Link>
          <Link href="#projects" className="text-sm font-medium hover:text-green-600 transition-colors">
            Projects
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-green-600 transition-colors">
            Contact
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Join Us
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Empowering Communities Through Development
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Join our mission to create sustainable change in communities across the nation. Together, we can
                    build a better tomorrow for those who need it most.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Get Involved
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#projects">
                    <Button variant="outline" size="lg">
                      View Projects
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://drive.google.com/thumbnail?id=19soJfPehaEqmTSNNI3oRj_iwAf4rgldx&sz=w1000"
                  width="600"
                  height="400"
                  alt="Community Development"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <div className="text-2xl font-bold">10,000+</div>
                  <p className="text-sm text-muted-foreground">Lives Impacted</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <div className="text-2xl font-bold">50+</div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-sm text-muted-foreground">Years of Service</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-sm text-muted-foreground">States Covered</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                src="https://drive.google.com/thumbnail?id=1k5MuHKGjXXHQHxnI_M85qu6qpbzl5YiD&sz=w1000"
                width="600"
                height="400"
                alt="Our Mission"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                    Our Mission
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Building Sustainable Communities</h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We believe in empowering communities through education, healthcare, skill development, and
                    sustainable livelihood programs. Our approach focuses on long-term impact and community ownership.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Education and Skill Development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Healthcare and Nutrition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Women Empowerment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Environmental Conservation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Preview */}
        <section id="projects" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800">Our Impact</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Current Projects</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our ongoing initiatives that are making a real difference in communities across the country.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src="https://drive.google.com/thumbnail?id=1dYXqiFJoicRMA0nF0MdEUe1Ep7fdHQ2t&sz=w1000"
                    width="300"
                    height="200"
                    alt="Education Project"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">Digital Literacy Program</h3>
                  <p className="text-gray-600 mb-4">
                    Empowering rural communities with digital skills and computer literacy.
                  </p>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src="https://drive.google.com/thumbnail?id=14mstrSGzBXT2euHtaniV4byPtVOihw5b&sz=w1000"
                    width="300"
                    height="200"
                    alt="Healthcare Project"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">Mobile Health Clinics</h3>
                  <p className="text-gray-600 mb-4">
                    Bringing essential healthcare services to remote and underserved areas.
                  </p>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src="https://drive.google.com/thumbnail?id=1lmvlyCIFHOEesj-_ZtmCO-MHPlBLw757&sz=w1000"
                    width="300"
                    height="200"
                    alt="Women Empowerment"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">Women's Skill Development</h3>
                  <p className="text-gray-600 mb-4">Training women in vocational skills for economic independence.</p>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get In Touch</h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ready to make a difference? Contact us to learn more about our programs or to get involved.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-1 w-full max-w-3xl">
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <Phone className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-sm text-gray-600">+91 8282828811</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <Mail className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-sm text-gray-600">info@y4d.ngo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <MapPin className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-sm text-gray-600">Y4D Foundation, 402, The Onyx, Near Euro School, Wakad, Pune, Maharashtra, India - 411057</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 py-6 w-full shrink-0 px-4 md:px-6 border-t bg-gray-900 text-white">
        <p className="text-xs text-gray-400">© 2024 Y4D NGO. All rights reserved.</p>
        <nav className="flex justify-center gap-4 sm:gap-6 w-full">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white">
            Terms of Service
          </Link>
        </nav>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="https://www.instagram.com/y4dteam/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg className="w-5 h-5 text-gray-400 hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17" cy="7" r="1.5" />
            </svg>
          </Link>
          <Link href="https://in.linkedin.com/company/y4dteam" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
            </svg>
          </Link>
          <Link href="http://www.facebook.com/Y4DTeam" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg className="w-5 h-5 text-gray-400 hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.734-.592-1.326-1.325-1.326z"/>
            </svg>
          </Link>
          <Link href="https://twitter.com/y4d_foundation" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482c-4.083-.205-7.697-2.16-10.125-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/>
            </svg>
          </Link>
          <Link href="https://www.youtube.com/user/Y4DTeam" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.163 3.5 12 3.5 12 3.5s-7.163 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.413 0 12 0 12s0 3.587.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.837 20.5 12 20.5 12 20.5s7.163 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.587 24 12 24 12s0-3.587-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  )
}
