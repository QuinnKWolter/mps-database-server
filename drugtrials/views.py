from .models import FindingResult,  DrugTrial, AdverseEvent, OpenFDACompound, CompoundAdverseEvent

from django.views.generic import ListView, DetailView
from django.shortcuts import render_to_response
from django.template import RequestContext


class DrugTrialList(ListView):
    """Displays a list of Drug Trials"""
    # model = FindingResult
    template_name = 'drugtrials/drugtrial_list.html'

    def get_queryset(self):
        queryset = FindingResult.objects.prefetch_related(
            'drug_trial',
            'descriptor',
            'finding_name',
            'value_units'
        ).select_related(
            'drug_trial__compound',
            'drug_trial__species',
            'finding_name__organ',
            'finding_name__finding_type'
        ).all()
        return queryset


class DrugTrialDetail(DetailView):
    """Details for a Drug Trial

    Contains next and previous buttons
    """
    model = DrugTrial
    template_name = 'drugtrials/drugtrial_detail.html'

    def get_context_data(self, **kwargs):
        context = super(DrugTrialDetail, self).get_context_data(**kwargs)

        results = FindingResult.objects.filter(
            drug_trial=self.object
        ).prefetch_related(
            'drug_trial',
            'descriptor',
            'finding_name',
            'value_units'
        ).select_related(
            'drug_trial__compound',
            'drug_trial__species',
            'finding_name__organ',
            'finding_name__finding_type'
        )

        trials = list(DrugTrial.objects.all().order_by('compound', 'id').values_list('id', flat=True))
        current = trials.index(self.object.id)

        if current == 0:
            previous_trial = trials[-1]
        else:
            previous_trial = trials[current - 1]
        if current == len(trials)-1:
            next_trial = trials[0]
        else:
            next_trial = trials[current + 1]

        context.update({
            'results': results,
            'previous': previous_trial,
            'next': next_trial,
        })

        return context


# def drug_trial_detail(request, *args, **kwargs):
#     c = RequestContext(request)
#
#     trial = get_object_or_404(DrugTrial, pk=kwargs.get('pk'))
#     results = FindingResult.objects.filter(
#         drug_trial=trial
#     ).prefetch_related(
#         'drug_trial',
#         'descriptor',
#         'finding_name',
#         'value_units'
#     ).select_related(
#         'drug_trial__compound',
#         'drug_trial__species',
#         'finding_name__organ',
#         'finding_name__finding_type'
#     )
#
#     trials = list(DrugTrial.objects.all().order_by('compound', 'id').values_list('id', flat=True))
#     current = trials.index(int(kwargs.get('pk')))
#
#     if current == 0:
#         previous = trials[-1]
#     else:
#         previous = trials[current - 1]
#     if current == len(trials)-1:
#         next = trials[0]
#     else:
#         next = trials[current + 1]
#
#     c.update({
#         'trial': trial,
#         'results': results,
#         'previous': previous,
#         'next': next,
#     })
#
#     return render_to_response('drugtrials/drugtrial_detail.html', c)


class AdverseEventsList(ListView):
    """Displays a list of Compound Adverse Events"""
    template_name = 'drugtrials/adverse_events_list.html'

    def get_queryset(self):
        queryset = CompoundAdverseEvent.objects.prefetch_related(
            'compound',
            'event'
        ).select_related(
            'compound__compound',
            'event__organ'
        ).all()
        return queryset


class AdverseEventDetail(DetailView):
    """Details for an Adverse Event (includes a time plot)

    Contains next and previous buttons
    """
    model = OpenFDACompound
    template_name = 'drugtrials/adverse_events_detail.html'

    def get_context_data(self, **kwargs):
        context = super(AdverseEventDetail, self).get_context_data(**kwargs)

        events = CompoundAdverseEvent.objects.filter(
            compound=self.object
        ).prefetch_related(
            'event'
        ).select_related(
            'event__organ'
        ).order_by('-frequency')

        compounds = list(OpenFDACompound.objects.all().order_by('compound').values_list('id', flat=True))
        current = compounds.index(self.object.id)

        if current == 0:
            previous_events = compounds[-1]
        else:
            previous_events = compounds[current - 1]
        if current == len(compounds)-1:
            next_events = compounds[0]
        else:
            next_events = compounds[current + 1]

        context.update({
            'events': events,
            'previous': previous_events,
            'next': next_events,
        })

        return context

# def adverse_events_detail(request, *args, **kwargs):
#     """Adverse event rates for the given compound"""
#
#     c = RequestContext(request)
#
#     compound = get_object_or_404(OpenFDACompound, pk=kwargs.get('pk'))
#     events = CompoundAdverseEvent.objects.filter(
#         compound=compound
#     ).prefetch_related(
#         'event'
#     ).select_related(
#         'event__organ'
#     ).order_by('-frequency')
#
#     compounds = list(OpenFDACompound.objects.all().order_by('compound').values_list('id', flat=True))
#     current = compounds.index(int(kwargs.get('pk')))
#
#     if current == 0:
#         previous = compounds[-1]
#     else:
#         previous = compounds[current - 1]
#     if current == len(compounds)-1:
#         next = compounds[0]
#     else:
#         next = compounds[current + 1]
#
#     c.update({
#         'compound': compound,
#         'events': events,
#         'previous': previous,
#         'next': next,
#     })
#
#     return render_to_response('drugtrials/adverse_events_detail.html', c)


# What to name function?
def compare_adverse_events(request):
    """Adverse event rates for the given adverse event"""

    c = RequestContext(request)

    compounds = OpenFDACompound.objects.all().prefetch_related(
        'compound'
    )

    # Alternative call
    # compounds = Compound.objects.filter(compoundadverseevent_set__isnull=False)

    adverse_events = AdverseEvent.objects.all().prefetch_related(
        'organ'
    )

    compound_frequency = {}
    adverse_event_frequency = {}

    for adverse_event in CompoundAdverseEvent.objects.all().prefetch_related('compound', 'event'):
        compound_frequency.setdefault(adverse_event.compound_id, []).append(adverse_event.frequency)
        adverse_event_frequency.setdefault(adverse_event.event_id, []).append(adverse_event.frequency)

    for adverse_event in adverse_events:
        adverse_event.frequency = sum(adverse_event_frequency.get(adverse_event.id, [0]))

    for compound in compounds:
        compound.frequency = sum(compound_frequency.get(compound.id, [0]))

    # Should I even bother putting events (perhaps even compounds) into the context?
    c.update({
        'compounds': compounds,
        'adverse_events': adverse_events
    })

    # What to name template?
    return render_to_response('drugtrials/compare_adverse_events.html', c)
