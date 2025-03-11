import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TopContributors() {
  // This would come from your API in a real app
  const contributors = [
    {
      address: "neutron1abc...",
      contributed: 2500,
      ralliesSupported: 12,
      token: "NTRN",
    },
    {
      address: "neutron1def...",
      contributed: 1800,
      ralliesSupported: 8,
      token: "tATOM",
    },
    {
      address: "neutron1ghi...",
      contributed: 1200,
      ralliesSupported: 5,
      token: "NTRN",
    },
    {
      address: "neutron1jkl...",
      contributed: 950,
      ralliesSupported: 4,
      token: "tATOM",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Top Contributors</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Celebrating the community members making a difference
            </p>
          </div>
        </div>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {contributors.map((contributor, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{contributor.address.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">{contributor.address}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  <div className="flex justify-between mt-2">
                    <span>Contributed:</span>
                    <span className="font-medium text-foreground">
                      {contributor.contributed} {contributor.token}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Rallies:</span>
                    <span className="font-medium text-foreground">{contributor.ralliesSupported}</span>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

