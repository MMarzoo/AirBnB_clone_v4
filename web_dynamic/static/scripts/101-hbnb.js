$(document).ready(function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};

  $('input#amenity_checkbox').change(function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checkedAmenities[$(this).attr('data-id')];
    }
    if (Object.values(checkedAmenities).length === 0) {
      $('.amenities H4').html('&nbsp;');
    } else {
      $('.amenities H4').text(Object.values(checkedAmenities).join(', '));
    }
  });

  $('input#state_checkbox').change(function () {
    if ($(this).is(':checked')) {
      checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checkedStates[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, checkedStates, checkedCities)
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;')
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  $('input#city_checkbox').change(function () {
    if ($(this).is(':checked')) {
      checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checkedCities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, checkedStates, checkedCities)
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;')
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search',
    data: '{}',
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (data) {
      data.sort((a, b) => a.name.localeCompare(b.name));
      for (const result of data) {
        console.log(data.description);
        const pluralGuest = result.max_guest > 1 ? 's' : '';
        const pluralBedroom = result.number_rooms > 1 ? 's' : '';
        const pluralBathroom = result.max_bathrooms > 1 ? 's' : '';
        $('section.places').append(`<article>
        <div class="title_box">
          <h2>${result.name}</h2>
          <div class="price_by_night">$${result.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${result.max_guest} Guest${pluralGuest}</div>
          <div class="number_rooms">${result.number_rooms} Bedroom${pluralBedroom}</div>
          <div class="number_bathrooms">${result.number_bathrooms} Bathroom${pluralBathroom}</div>
        </div>
        <div class="user">
          <b>Owner:</b> TBD
        </div>
        <div class="description">
          ${result.description}
        </div>
        <div class="reviews">
            <h2>Reviews<span class="showtoggle" place_id="${result.id}">Show</span></h2>
            <ul>
            </ul>
          </div>
        </article>`);
      }
    }
  });

  $('button').on('click', function() {
    const amenityIdList = Object.keys(checkedAmenities);
    const stateIdList = Object.keys(checkedStates);
    const cityIdList = Object.keys(checkedCities);

    const requestData = JSON.stringify({
      'states': stateIdList,
      'cities': cityIdList,
      'amentites': amenityIdList
    });

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      data: requestData,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (data) {
        data.sort((a, b) => a.name.localeCompare(b.name));
        for (const result of data) {
          console.log(data.description);
          const pluralGuest = result.max_guest > 1 ? 's' : '';
          const pluralBedroom = result.number_rooms > 1 ? 's' : '';
          const pluralBathroom = result.max_bathrooms > 1 ? 's' : '';
          $('section.places').append(`<article>
          <div class="title_box">
            <h2>${result.name}</h2>
            <div class="price_by_night">$${result.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${result.max_guest} Guest${pluralGuest}</div>
            <div class="number_rooms">${result.number_rooms} Bedroom${pluralBedroom}</div>
            <div class="number_bathrooms">${result.number_bathrooms} Bathroom${pluralBathroom}</div>
          </div>
          <div class="user">
            <b>Owner:</b> TBD
          </div>
          <div class="description">
            ${result.description}
          </div>
          </article>`);
        }
      }
    });
  });
});
