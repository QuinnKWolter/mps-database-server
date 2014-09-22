# coding=utf-8

from django.http import *
from django.shortcuts import render_to_response
from django.template import RequestContext
import json
from .models import *

from bioservices import ChEMBLdb

from bioactivities.models import Assay, Target

# Calling main is and always will be indicative of an error condition.
# ajax.py is strictly for AJAX requests

# Ajax requests are sent to ajax(request) and funneled into the correct
# handler function using a simulated Python switch routing function


def main(request):
    return render_to_response('ajax_error.html',
                              context_instance=RequestContext(request))


def fetch_compound_name(request):
    data = {}

    data.update(
        {'name': Compound.objects.get(id=request.POST['compound_id']).name})

    return HttpResponse(json.dumps(data),
                        content_type="application/json")


def chembl_error(error):
    data = {}
    data.update({'error': error})

    return HttpResponse(json.dumps(data),
                        content_type="application/json")


def fetch_chemblid_data(request):
    chemblid = request.POST['chemblid']
    selector = request.POST['selector']

    if not chemblid or not selector:
        return main(request)

    element = {
        'compound': Compound.objects.filter(chemblid=chemblid),
        'assay': Assay.objects.filter(chemblid=chemblid),
        'target': Target.objects.filter(chemblid=chemblid),
    }[selector]

    if chemblid.startswith('CHEMBL') and chemblid[6:].isdigit():

        if element:
            return chembl_error(
                '"{}" is already in the database.'.format(chemblid)
            )

        else:

            try:
                if 'compound' == selector:
                    data = ChEMBLdb().get_compounds_by_chemblId(str(chemblid))
                elif 'assay' == selector:
                    data = ChEMBLdb().get_assay_by_chemblId(str(chemblid))
                elif 'target' == selector:
                    data = ChEMBLdb().get_target_by_chemblId(str(chemblid))

            except Exception:
                return chembl_error(
                    '"{}" did not match any compound records.'.format(chemblid)
                )
    else:
        return chembl_error(
            '"{}" is not a valid ChEMBL id.'.format(chemblid)
        )

    return HttpResponse(json.dumps(data),
                        content_type="application/json")


switch = {
    'fetch_compound_name': fetch_compound_name,
    'fetch_chemblid_data': fetch_chemblid_data,
}


def ajax(request):
    post_call = request.POST['call']

    # Abort if there is no valid call sent to us from Javascript
    if not post_call:
        return main(request)

    # Route the request to the correct handler function
    # and pass request to the functions
    try:
        # select the function from the dictionary
        procedure = switch[post_call]

    # If all else fails, handle the error message
    except KeyError:
        return main(request)

    else:
        # execute the function
        return procedure(request)

