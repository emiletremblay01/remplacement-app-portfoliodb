import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { remplacementId: string } }
) {
  try {
    if (!params.remplacementId) {
      return new NextResponse("Missing remplacementId", { status: 400 });
    }

    const remplacement = await prismadb.remplacement.findUnique({
      where: {
        id: params.remplacementId,
      },
    });

    return NextResponse.json(remplacement);
  } catch (error) {
    console.log("[remplacement_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { remplacementId: string } }
) {
  try {
    const body = await req.json();

    const {
      nomEquipier,
      dateDemande,
      recuPar,
      dateQuart,
      posteQuart,
      heuresQuart,
      courrielEnvoye,
      statut,
      nomEquipierRemplacant,
      remplacementEffectuePar,
    } = body;

    if (!nomEquipier) {
      return new NextResponse("nomEquipier required", { status: 400 });
    }

    if (!dateDemande) {
      return new NextResponse("dateDemande required", { status: 400 });
    }

    if (!recuPar) {
      return new NextResponse("recuPar required", { status: 400 });
    }

    if (!dateQuart) {
      return new NextResponse("dateQuart required", { status: 400 });
    }

    if (!posteQuart) {
      return new NextResponse("posteQuart required", { status: 400 });
    }

    if (!heuresQuart) {
      return new NextResponse("heuresQuart required", { status: 400 });
    }

    if (!courrielEnvoye) {
      return new NextResponse("courrielEnvoye required", { status: 400 });
    }

    if (!statut) {
      return new NextResponse("statut required", { status: 400 });
    }

    if (statut === "approuvé") {
      if (!nomEquipierRemplacant) {
        return new NextResponse("nomEquipierRemplacant required", {
          status: 400,
        });
      }

      if (!remplacementEffectuePar) {
        return new NextResponse("remplacementEffectuePar required", {
          status: 400,
        });
      }
    }

    const remplacement = await prismadb.remplacement.update({
      where: {
        id: params.remplacementId,
      },
      data: {
        nomEquipier,
        dateDemande,
        recuPar,
        dateQuart,
        posteQuart,
        heuresQuart,

        courrielEnvoye,
        statut,
        nomEquipierRemplacant,
        remplacementEffectuePar,
      },
    });

    return NextResponse.json(remplacement);
  } catch (error) {
    console.log("[remplacement_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { remplacementId: string } }
) {
  try {
    if (!params.remplacementId) {
      return new NextResponse("Missing remplacementId", { status: 400 });
    }

    const remplacement = await prismadb.remplacement.deleteMany({
      where: {
        id: params.remplacementId,
      },
    });

    return NextResponse.json(remplacement);
  } catch (error) {
    console.log("[remplacement_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
