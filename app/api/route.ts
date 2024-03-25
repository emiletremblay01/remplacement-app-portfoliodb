import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

// false | 'force-cache' | 0 | number
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nomEquipier) {
      return new NextResponse("nomEquipier required", { status: 400 });
    }

    if (!body.dateDemande) {
      return new NextResponse("dateDemande required", { status: 400 });
    }

    if (!body.recuPar) {
      return new NextResponse("recuPar required", { status: 400 });
    }

    if (!body.dateQuart) {
      return new NextResponse("dateQuart required", { status: 400 });
    }

    if (!body.posteQuart) {
      return new NextResponse("posteQuart required", { status: 400 });
    }

    if (!body.heuresQuart) {
      return new NextResponse("heuresQuart required", { status: 400 });
    }

    const remplacement = await prismadb.remplacement.create({
      data: {
        nomEquipier: body.nomEquipier,
        dateDemande: body.dateDemande,
        recuPar: body.recuPar,
        dateQuart: body.dateQuart,
        posteQuart: body.posteQuart,
        heuresQuart: body.heuresQuart,

        statut: "en attente",
        nomEquipierRemplacant: "",
        remplacementEffectuePar: "",
      },
    });

    return NextResponse.json(remplacement);
  } catch (error) {
    console.log("[REMPLACEMENT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const remplacements = await prismadb.remplacement.findMany();

    return NextResponse.json(remplacements);
  } catch (error) {
    console.log("[REMPLACEMENT_GET]", error);
    return new NextResponse("Internal Server Error!!!", { status: 500 });
  }
}
