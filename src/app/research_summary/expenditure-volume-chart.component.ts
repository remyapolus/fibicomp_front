import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";

import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardData } from '../dashboard/dashboard-data.service';

@Component( {
    selector: 'areachart',
    template: `<div id="chart_divEvolution" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" (window:resize)="onResize($event)"></div>`,
    styleUrls: ['../../assets/css/style.css']
} )

export class ExpenditureVolumeChartComponent extends GoogleChartService implements OnInit {
    private options;
    private data;
    private chart;
    private result: any = {};
    private researchSummaryList: any[];
    private directCost: any[];
    private fACost: any[];
    private areaChartList: any[] = [];
    private areachartLength: number;

    private subscription: ISubscription;

    constructor( private ref: ChangeDetectorRef, public dashboardData: DashboardData ) {
        super();
    }

    ngOnInit() {
        this.subscription = this.dashboardData.dashboardAreaChartData1Variable.subscribe( dashboardAreaChartData1 => {
            if ( dashboardAreaChartData1.length > 1 ) {
                this.researchSummaryList = dashboardAreaChartData1;
                super.googleChartFunction();
            }
            this.ref.detectChanges();
        } );
    }

    ngOnDestroy() {
        if ( this.subscription )
            this.subscription.unsubscribe();
        this.researchSummaryList = [];
    }

    drawGraph() {
        this.researchSummaryList = this.dashboardData.getdashboardAreaChartData();
        if ( this.researchSummaryList != null && this.researchSummaryList !== undefined ) {
            this.areachartLength = this.researchSummaryList.length;
            this.areaChartList = [];
            this.areaChartList.push( ['Year', 'Direct', 'FA'] );
            for ( let i = 0; i < this.areachartLength; i++ ) {
                this.areaChartList.push( [this.researchSummaryList[i][0], this.researchSummaryList[i][1], this.researchSummaryList[i][2]] );
            }
            this.data = this.createDataTable( this.areaChartList );
            this.options = {
                hAxis: {
                    title: 'Year',
                    minValue: 0,
                    textStyle: {color: '#424242', fontName: 'Segoe UI'},
                    titleTextStyle: { color: '#424242'}
                },
                legend: { position: 'top', alignment: 'end', textStyle: {color: '#424242', fontName: 'Segoe UI'} },
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                    animation:{
                        startup: true,
                        duration: 1000,
                        easing: 'linear'
                      },
                vAxis: { title: 'Cost Amount', textStyle: { color: '#424242', fontName: 'Segoe UI' }, titleTextStyle: { color: '#424242', fontName: 'Segoe UI' } }
            };
                this.chart = this.createAreaChart( document.getElementById( 'chart_divEvolution' ) );
                this.chart.draw( this.data, this.options );
        }
    }

    onResize( event ) {
            this.chart.draw( this.data, this.options );
    }
}
