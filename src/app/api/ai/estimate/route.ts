import { NextResponse } from 'next/server';

export interface EstimateRequest {
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'BOUNDARY_WALL' | 'SLAB_FOUNDATION' | 'INTERIOR_PLASTER';
  builtUpAreaSqFt: number;
  floors: number;
  mixGrade?: 'M20' | 'M25' | 'M30';
  brickType?: 'RED_BRICK' | 'AAC_BLOCK';
}

export async function POST(req: Request) {
  try {
    const body: EstimateRequest = await req.json();
    const area = Number(body.builtUpAreaSqFt) || 1000;
    const floors = Number(body.floors) || 1;
    const totalSlabArea = area * floors;
    const gradeMultiplier = body.mixGrade === 'M25' ? 1.08 : body.mixGrade === 'M30' ? 1.15 : 1.0;

    // Engineering multipliers per sq.ft
    let cementBags = Math.round(totalSlabArea * 0.42 * gradeMultiplier);
    let steelTons = parseFloat(((totalSlabArea * 3.8) / 1000).toFixed(2));
    let sandTons = Math.round(totalSlabArea * 0.085);
    let aggregateTons = Math.round(totalSlabArea * 0.11);
    let bricksCount = body.brickType === 'AAC_BLOCK' 
      ? Math.round(totalSlabArea * 1.35) 
      : Math.round(totalSlabArea * 18.5);

    let masonDays = Math.round(totalSlabArea * 0.08);
    let helperDays = Math.round(totalSlabArea * 0.16);

    // Adjust for project types
    if (body.projectType === 'BOUNDARY_WALL') {
      cementBags = Math.round(area * 0.15);
      steelTons = parseFloat(((area * 0.8) / 1000).toFixed(2));
      sandTons = Math.round(area * 0.035);
      aggregateTons = Math.round(area * 0.04);
      bricksCount = Math.round(area * 14);
      masonDays = Math.round(area * 0.04);
      helperDays = Math.round(area * 0.07);
    } else if (body.projectType === 'SLAB_FOUNDATION') {
      cementBags = Math.round(area * 0.35 * gradeMultiplier);
      steelTons = parseFloat(((area * 4.5) / 1000).toFixed(2));
      sandTons = Math.round(area * 0.07);
      aggregateTons = Math.round(area * 0.1);
      bricksCount = 0;
      masonDays = Math.round(area * 0.05);
      helperDays = Math.round(area * 0.12);
    } else if (body.projectType === 'INTERIOR_PLASTER') {
      cementBags = Math.round(area * 0.12);
      steelTons = 0;
      sandTons = Math.round(area * 0.04);
      aggregateTons = 0;
      bricksCount = 0;
      masonDays = Math.round(area * 0.035);
      helperDays = Math.round(area * 0.05);
    }

    // Material item line with BuildNexus live product references for direct cart insertion
    const items = [
      {
        materialId: 'mat-1',
        name: 'UltraTech PPC Cement (50kg)',
        category: 'cement',
        quantity: cementBags,
        unit: 'bag',
        unitPrice: 380,
        totalCost: cementBags * 380,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        supplierId: 'sup-1',
        supplierName: 'Lakshmi Building Supplies',
      },
      ...(steelTons > 0 ? [{
        materialId: 'mat-2',
        name: 'Tata Tiscon 550D TMT Rebar (12mm)',
        category: 'steel',
        quantity: Math.max(1, Math.round(steelTons * 1000)), // converted to kg for purchase unit or per ton
        unit: 'kg',
        unitPrice: 65,
        totalCost: Math.round(steelTons * 1000 * 65),
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
        supplierId: 'sup-2',
        supplierName: 'Kaveri Steel Corporation',
      }] : []),
      ...(sandTons > 0 ? [{
        materialId: 'mat-3',
        name: 'Manufactured M-Sand (Zone II, Washed)',
        category: 'sand',
        quantity: sandTons,
        unit: 'ton',
        unitPrice: 1450,
        totalCost: sandTons * 1450,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        supplierId: 'sup-3',
        supplierName: 'Sri Balaji Aggregates & Sand',
      }] : []),
      ...(aggregateTons > 0 ? [{
        materialId: 'mat-4',
        name: '20mm Blue Metal Coarse Aggregate',
        category: 'aggregates',
        quantity: aggregateTons,
        unit: 'ton',
        unitPrice: 1100,
        totalCost: aggregateTons * 1100,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
        supplierId: 'sup-3',
        supplierName: 'Sri Balaji Aggregates & Sand',
      }] : []),
      ...(bricksCount > 0 ? [{
        materialId: 'mat-5',
        name: body.brickType === 'AAC_BLOCK' ? 'Aerocon AAC Lightweight Blocks (600x200x150mm)' : 'Standard Red Clay Kiln Bricks (Class 1)',
        category: 'bricks',
        quantity: bricksCount,
        unit: 'piece',
        unitPrice: body.brickType === 'AAC_BLOCK' ? 62 : 9,
        totalCost: bricksCount * (body.brickType === 'AAC_BLOCK' ? 62 : 9),
        image: 'https://images.unsplash.com/photo-1584463699042-45a8e2cbce18?auto=format&fit=crop&w=400&q=80',
        supplierId: 'sup-1',
        supplierName: 'Lakshmi Building Supplies',
      }] : []),
    ];

    const materialSubtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const estimatedLabourCost = (masonDays * 850) + (helperDays * 550);
    const gstAmount = Math.round(materialSubtotal * 0.18);
    const logisticsFee = Math.round(materialSubtotal * 0.04);
    const warehouseStagingFee = 250; // BuildNexus safety buffer
    const grandTotal = materialSubtotal + estimatedLabourCost + gstAmount + logisticsFee + warehouseStagingFee;

    return NextResponse.json({
      success: true,
      summary: {
        totalArea: totalSlabArea,
        cementBags,
        steelTons,
        sandTons,
        aggregateTons,
        bricksCount,
        masonDays,
        helperDays,
        materialSubtotal,
        estimatedLabourCost,
        gstAmount,
        logisticsFee,
        warehouseStagingFee,
        grandTotal,
      },
      items,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
